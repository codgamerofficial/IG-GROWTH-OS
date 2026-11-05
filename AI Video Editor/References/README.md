# AI Video Editor — References

## Purpose
This directory stores reference videos and reels whose visual style, editing rhythm, typography, and color grading you like.

## Ingestion & Frame Extraction Workflow
1. **Drop Videos**: Place your reference videos (up to your last 5-10 videos or external inspirational reels) in `.mp4` or `.mov` format here.
2. **Automated 1-FPS Frame Sampling**:
   - The AI Video Editor uses FFmpeg to extract 1 frame per second into a temporary visual inspection buffer.
   - Example command:
     ```bash
     ffmpeg -i "References/sample.mp4" -vf fps=1 "References/frames/%04d.jpg"
     ```
3. **Visual AI Analysis (Multimodal Gemini Vision)**:
   - Fonts (nearest Google font matches).
   - Color palettes extracted as exact HEX codes.
   - Caption styling (background pill, drop shadows, animation curves).
   - Camera movement (dynamic zoom, pan, stationary framing).
   - Cut frequency (average shot length, cuts per minute).
4. **Auto-update**:
   - Extracted visual style rules automatically populate `Brand Kit/brand-kit.md` and `Editing Style/editing-style-rules.json`.

