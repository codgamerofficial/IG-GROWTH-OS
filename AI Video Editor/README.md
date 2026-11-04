# RIIQX — AI Video Editor Master Workspace
## Production-Grade AI-Powered Video Editing Pipeline
**System Architecture:** HyperFrames Motion Graphics • FFmpeg Native Processing • OpenAI Whisper • yt-dlp Reference Intelligence

---

### Workspace Directory Structure
- `raw footage/`: Original high-resolution creator footage (`uploads/`, `processed/`, `metadata/`)
- `reference/`: Reference reels, pacing breakdowns, and style analysis (`uploaded-reels/`, `downloaded-references/`, `reference-analysis/`)
- `export/`: Final rendered videos and audit reports (`final-videos/`, `preview-renders/`, `thumbnails/`, `render-reports/`)
- `projects/`: User video project files (`active/`, `completed/`)
- `assets/`: Music tracks, sound effects, B-roll images, typography, and logos (`music/`, `sound-effects/`, `images/`, `fonts/`, `logos/`, `overlays/`)
- `styles/`: Reusable style sheets and brand guidelines (`style-sheet.md`, `brand-guidelines.json`, `style-presets/`)
- `metadata/`: Word-level transcripts, editing blueprints, and approved storyboards (`transcripts/`, `edit-plans/`, `storyboards/`, `project-config/`)

---

### Non-Destructive Principles
1. Original raw footage is never overwritten or destroyed.
2. Every render requires explicit storyboard approval.
3. Every export is validated with FFprobe for duration, resolution, audio streams, and frame integrity.
