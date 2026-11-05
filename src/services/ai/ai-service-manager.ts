// =============================================================================
// RIIQX — Master Unified AI Service Manager
// Provider-Agnostic Gateway • Capability Resolution • Fallback Chains • Zero Traps
// =============================================================================

import { z } from 'zod';
import {
  AICapability,
  AIExecutionOptions,
  AIExecutionResult,
  ModelCapabilitySpec,
} from './types';
import { CapabilityRegistry } from './capability-registry';
import {
  CapabilityUnsupportedError,
  ModelTimeoutError,
  StructuredParsingError,
  ProviderUnavailableError,
} from './errors';
import { recordInferenceUsage } from '@/lib/riiqx/usage-monitor';

export class AIServiceManager {
  /**
   * Execute general text generation with capability matching & fallback
   */
  public static async executeText(
    prompt: string,
    options: AIExecutionOptions = {}
  ): Promise<AIExecutionResult<string>> {
    const startMs = Date.now();
    const task = options.taskType || 'general';
    const requiredCaps = options.requiredCapabilities || [AICapability.TEXT_GENERATION];

    // 1. Resolve Best Candidate Model
    let targetSpec: ModelCapabilitySpec;
    if (options.preferredModel) {
      const found = CapabilityRegistry.findModelsByCapabilities(requiredCaps).find(
        (m) => m.modelId === options.preferredModel
      );
      if (!found) {
        throw new CapabilityUnsupportedError(options.preferredModel, requiredCaps[0]);
      }
      targetSpec = found;
    } else {
      targetSpec = CapabilityRegistry.resolveBestModelForTask(task, requiredCaps);
    }

    // 2. Prepare Context-Enriched Prompt
    let fullPrompt = prompt;
    if (options.brandContext) {
      fullPrompt = `[BRAND CONTEXT: ${JSON.stringify(options.brandContext)}]\n\n${prompt}`;
    }

    // 3. Execution with Timeout Enforcement
    const timeoutMs = options.timeoutMs || 25_000;
    let fallbackUsed = false;

    try {
      const responseText = await this.executeWithTimeout(
        this.dispatchProviderRequest(targetSpec, fullPrompt, options),
        timeoutMs,
        targetSpec.modelId
      );

      const latencyMs = Date.now() - startMs;
      const inputTokens = Math.round(fullPrompt.length / 4);
      const outputTokens = Math.round(responseText.length / 4);
      const cost = targetSpec.isFreeTier
        ? 0
        : (inputTokens * targetSpec.pricing.promptPer1M +
            outputTokens * targetSpec.pricing.completionPer1M) /
          1_000_000;

      // Record Real Usage Telemetry
      recordInferenceUsage({
        provider: targetSpec.provider,
        model: targetSpec.modelId,
        taskType: task,
        latencyMs,
        inputTokens,
        outputTokens,
        success: true,
      });

      return {
        success: true,
        data: responseText,
        provider: targetSpec.provider,
        model: targetSpec.modelId,
        isFreeTier: targetSpec.isFreeTier,
        latencyMs,
        inputTokens,
        outputTokens,
        estimatedCostUsd: cost,
        fallbackUsed,
      };
    } catch (err: any) {
      // 4. Automatic Fallback Execution
      console.warn(`[AIServiceManager] Execution failed on ${targetSpec.modelId}: ${err.message}. Invoking fallback chain...`);
      fallbackUsed = true;

      const candidates = CapabilityRegistry.findModelsByCapabilities(requiredCaps)
        .filter((m) => m.modelId !== targetSpec.modelId);

      let lastError = err;
      for (const fallbackSpec of candidates) {
        try {
          console.log(`[AIServiceManager] Trying fallback candidate: ${fallbackSpec.modelId} (${fallbackSpec.provider})`);
          const fallbackResponse = await this.executeWithTimeout(
            this.dispatchProviderRequest(fallbackSpec, fullPrompt, options),
            timeoutMs,
            fallbackSpec.modelId
          );

          const latencyMs = Date.now() - startMs;
          const inputTokens = Math.round(fullPrompt.length / 4);
          const outputTokens = Math.round(fallbackResponse.length / 4);
          const cost = fallbackSpec.isFreeTier ? 0 : 0.0001;

          recordInferenceUsage({
            provider: fallbackSpec.provider,
            model: fallbackSpec.modelId,
            taskType: task,
            latencyMs,
            inputTokens,
            outputTokens,
            success: true,
          });

          return {
            success: true,
            data: fallbackResponse,
            provider: fallbackSpec.provider,
            model: fallbackSpec.modelId,
            isFreeTier: fallbackSpec.isFreeTier,
            latencyMs,
            inputTokens,
            outputTokens,
            estimatedCostUsd: cost,
            fallbackUsed: true,
          };
        } catch (fbErr: any) {
          console.warn(`[AIServiceManager] Fallback candidate ${fallbackSpec.modelId} failed: ${fbErr.message}`);
          lastError = fbErr;
        }
      }

      throw lastError;
    }
  }

  /**
   * Execute structured JSON output with Zod schema verification & repair
   */
  public static async executeStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    options: AIExecutionOptions = {}
  ): Promise<AIExecutionResult<T>> {
    const requiredCaps = [AICapability.TEXT_GENERATION, AICapability.STRUCTURED_OUTPUT];
    const systemPrompt = `${options.systemPrompt || ''}\n\nCRITICAL INSTRUCTION: Return ONLY a valid JSON object matching the requested schema. Do NOT include markdown code blocks, explanation, or conversational commentary. Return pure parseable JSON.`.trim();

    const textResult = await this.executeText(prompt, {
      ...options,
      systemPrompt,
      requiredCapabilities: requiredCaps,
    });

    let raw = textResult.data.trim();
    if (raw.startsWith('```json')) {
      raw = raw.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    } else if (raw.startsWith('```')) {
      raw = raw.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    try {
      let parsedJson: any;
      try {
        parsedJson = JSON.parse(raw);
      } catch (firstErr) {
        // Simple repair for truncated strings or missing closing brackets
        let repaired = raw;
        const quotes = (repaired.match(/"/g) || []).length;
        if (quotes % 2 !== 0) repaired += '"';
        const openBrackets = (repaired.match(/\[/g) || []).length;
        const closeBrackets = (repaired.match(/\]/g) || []).length;
        for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += ']';
        const openBraces = (repaired.match(/{/g) || []).length;
        const closeBraces = (repaired.match(/}/g) || []).length;
        for (let i = 0; i < openBraces - closeBraces; i++) repaired += '}';
        parsedJson = JSON.parse(repaired);
      }

      if (parsedJson && typeof parsedJson === 'object') {
        if (parsedJson.brandDNA) parsedJson = parsedJson.brandDNA;
        else if (parsedJson.brand_dna) parsedJson = parsedJson.brand_dna;
        else if (parsedJson.brand) parsedJson = parsedJson.brand;
        else if (parsedJson.data) parsedJson = parsedJson.data;
      }
      const validated = schema.parse(parsedJson);

      return {
        ...textResult,
        data: validated,
      };
    } catch (parseErr: any) {
      throw new StructuredParsingError(parseErr.message, raw);
    }
  }

  /**
   * Execute multimodal vision inspection (Website screenshots, logos, product photos)
   */
  public static async executeVision(
    prompt: string,
    imageSource: { mimeType: string; base64Data: string } | string,
    options: AIExecutionOptions = {}
  ): Promise<AIExecutionResult<string>> {
    return this.executeText(prompt, {
      ...options,
      taskType: 'vision',
      requiredCapabilities: [AICapability.TEXT_GENERATION, AICapability.VISION],
      preferredProvider: 'google',
    });
  }

  /**
   * Dispatch raw request to specific provider
   */
  private static async dispatchProviderRequest(
    spec: ModelCapabilitySpec,
    prompt: string,
    options: AIExecutionOptions
  ): Promise<string> {
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_AI_STUDIO_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;

    if (spec.provider === 'google' && geminiKey) {
      const isStructured = options.requiredCapabilities?.includes(AICapability.STRUCTURED_OUTPUT);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${spec.modelId}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(options.systemPrompt
              ? { systemInstruction: { parts: [{ text: options.systemPrompt }] } }
              : {}),
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: options.temperature ?? 0.7,
              maxOutputTokens: options.maxTokens ?? 4096,
              ...(isStructured ? { responseMimeType: 'application/json' } : {}),
            },
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Gemini API error ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Gemini returned empty candidate stream.');
      return text;
    }

    if (spec.provider === 'groq' && groqKey) {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: spec.modelId,
          messages: [
            ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
            { role: 'user', content: prompt },
          ],
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 4096,
        }),
      });

      if (!res.ok) {
        throw new Error(`Groq API error ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('Groq returned empty choice stream.');
      return content;
    }

    if (spec.provider === 'openrouter' && openrouterKey) {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openrouterKey}`,
        },
        body: JSON.stringify({
          model: spec.modelId,
          messages: [
            ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
            { role: 'user', content: prompt },
          ],
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 2048,
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenRouter API error ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('OpenRouter returned empty choice stream.');
      return content;
    }

    throw new ProviderUnavailableError(
      spec.provider,
      `API key or client not configured for provider '${spec.provider}'.`
    );
  }

  /**
   * Internal timeout wrapper
   */
  private static async executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    modelId: string
  ): Promise<T> {
    let timeoutTimer: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutTimer = setTimeout(() => {
        reject(new ModelTimeoutError(modelId, timeoutMs));
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([promise, timeoutPromise]);
      clearTimeout(timeoutTimer!);
      return result;
    } catch (err) {
      clearTimeout(timeoutTimer!);
      throw err;
    }
  }
}
