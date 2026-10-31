# RIIQX Autonomous AI Editing Engine Report
## Natural-Language Video Direction, 5-Track Timeline, and Kinetic Subtitle Generation

---

## 1. Natural Language Prompt-to-Edit Planner

The editing planner (`src/lib/creator/editing-planner/index.ts`) allows creators to type natural-language instructions in English, Bengali, or mixed multilingual text:

```
User: "Make this a fast cinematic Reel with cyberpunk neon filter and bold yellow subtitles"
```

The planner analyzes the directive and compiles an actionable `EditingPlan`:
- **Style:** `cinematic`
- **Color LUT:** `cyberpunk` (Electric neon gradient)
- **Speed Velocity:** `1.5x`
- **Subtitles:** `bold_yellow` (MrBeast high-contrast style)
- **Target Aspect:** `9:16` vertical (1080x1920)

---

## 2. Supported Editing Styles & Presets

| Style Preset | Visual Pacing | Transition Default | Caption Preset | Best Suited For |
|---|---|---|---|---|
| **Cinematic** | 1.0x - 1.2x | Smooth Crossfade | Minimalist White | Storytelling, Travel, High-End UGC |
| **Viral Fast** | 1.5x - 2.0x | Quick Whip / Jump | Viral Yellow (MrBeast) | Shorts, TikTok, High-Retention Hooks |
| **Cyberpunk** | 1.25x | Glitch / Zoom | Cyber Neon Blue | Tech, AI, Futuristic Product Demos |
| **Dark Noir** | 0.8x - 1.0x | Slow Dissolve | Centered Classic | Interviews, Deep Documentaries |
| **Warm 90s** | 1.0x | Film Grain Jump | Analog VHS | Lifestyle, Nostalgia, Streetwear |

---

## 3. Kinetic Subtitle Engine

- **High-Velocity Hook Highlighting:** Identifies the first 2-3 words of each sentence and renders them in accent colors (`#FFD43B` or `#FF6B5E`) to grab audience attention within the 0.5s-1.5s scroll window.
- **Dual Export Support:**
  - **Burned-in Subtitles:** Rendered directly onto the canvas frames at 30 FPS.
  - **Sidecar Files:** Generates standard SubRip (`.srt`) and WebVTT (`.vtt`) files for platform closed-captioning.
- **Safe Zone Margin:** Renders text between 70% and 80% vertical height to clear platform UI (usernames, audio titles, like/comment buttons).

