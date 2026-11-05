// =============================================================================
// RIIQX — Master AI Error Hierarchy & Typed Exceptions
// =============================================================================

import { AICapability, AIProviderId } from './types';

export class AIServiceError extends Error {
  public readonly code: string;
  public readonly provider?: AIProviderId;
  public readonly retryable: boolean;

  constructor(message: string, code: string, provider?: AIProviderId, retryable: boolean = false) {
    super(message);
    this.name = 'AIServiceError';
    this.code = code;
    this.provider = provider;
    this.retryable = retryable;
  }
}

export class CapabilityUnsupportedError extends AIServiceError {
  constructor(modelId: string, capability: AICapability) {
    super(
      `Model '${modelId}' does not support requested capability '${capability}'.`,
      'CAPABILITY_UNSUPPORTED',
      undefined,
      false
    );
    this.name = 'CapabilityUnsupportedError';
  }
}

export class ProviderUnavailableError extends AIServiceError {
  constructor(provider: AIProviderId, reason: string) {
    super(
      `AI Provider '${provider}' is currently unavailable: ${reason}`,
      'PROVIDER_UNAVAILABLE',
      provider,
      true
    );
    this.name = 'ProviderUnavailableError';
  }
}

export class CircuitBreakerOpenError extends AIServiceError {
  constructor(provider: AIProviderId, coolDownSeconds: number) {
    super(
      `Circuit breaker for provider '${provider}' is OPEN due to repeated failures. Cooling down for ${coolDownSeconds}s.`,
      'CIRCUIT_BREAKER_OPEN',
      provider,
      false
    );
    this.name = 'CircuitBreakerOpenError';
  }
}

export class ModelTimeoutError extends AIServiceError {
  constructor(modelId: string, timeoutMs: number) {
    super(
      `Execution on model '${modelId}' exceeded deadline of ${timeoutMs}ms.`,
      'MODEL_TIMEOUT',
      undefined,
      true
    );
    this.name = 'ModelTimeoutError';
  }
}

export class StructuredParsingError extends AIServiceError {
  public readonly rawResponse: string;

  constructor(message: string, rawResponse: string) {
    super(
      `Failed to parse model response into requested schema: ${message}`,
      'STRUCTURED_PARSE_FAILED',
      undefined,
      true
    );
    this.name = 'StructuredParsingError';
    this.rawResponse = rawResponse;
  }
}

