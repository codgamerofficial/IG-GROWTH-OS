# RIIQX Media Ingestion & Upload Report
## Mobile-First Capture, Multi-Format Validation, and Safe Storage Pipeline

---

## 1. Supported Ingestion Channels

The ingestion engine (`src/lib/creator/media-ingestion/index.ts`) supports native file pickers and mobile hardware triggers without forcing users to transfer files to desktop computers:

1. **Smartphone Camera Capture:**
   - Triggered via `<input type="file" accept="image/*,video/*" capture="environment" />`.
   - Directly activates native camera sensor on iOS Safari and Android Chrome.
2. **Phone Gallery / Photos Library:**
   - Multi-file selection (`multiple`) supporting mixed images and video clips.
3. **Desktop Drag & Drop:**
   - Direct drag over dropzone with instant client-side thumbnail generation.

---

## 2. Format & Size Validation Matrix

| Format Group | Extensions / Mime Types | Max Size | Status | Verification |
|---|---|---|---|---|
| **Video** | `.mp4` (`video/mp4`) | 250 MB | ✅ Supported | Native Playback & 9:16 Crop |
| **Video (Apple)** | `.mov` (`video/quicktime`) | 250 MB | ✅ Supported | Transcoding / Canvas Ingestion |
| **Video (Web)** | `.webm` (`video/webm`) | 250 MB | ✅ Supported | VP8/VP9 Native Playback |
| **Photos** | `.jpg`, `.jpeg` (`image/jpeg`) | 25 MB | ✅ Supported | High-res Texture Ingestion |
| **Photos** | `.png` (`image/png`) | 25 MB | ✅ Supported | Alpha Channel Preserved |
| **Photos (Web)** | `.webp` (`image/webp`) | 25 MB | ✅ Supported | Optimized Web Standard |
| **Photos (Apple)**| `.heic`, `.heif` (`image/heic`) | 25 MB | ✅ Supported | Supported on Safari & Modern Web |
| **Invalid Files** | `.exe`, `.zip`, `.bat`, etc. | Any | ❌ Rejected | Blocked at validation gate |

---

## 3. Upload Security & Privacy

1. **Zero Public Leakage:** Uploaded media is initially scoped to local client memory (`URL.createObjectURL`) and private application storage.
2. **Non-Blocking Thumbnails:** Extracts high-contrast frame thumbnails immediately upon file selection to provide visual feedback before encoding.
3. **Clear Diagnostic Rejection:** If a file exceeds 250MB or has an unapproved mime type, the user receives an actionable error alert rather than a silent failure.

