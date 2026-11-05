# AI Video Editor — Raw Footage & Video Projects

## Purpose
This directory stores one dedicated folder per video project awaiting editing or currently in progress.

## Project Folder Structure
Each subfolder represents a single video project:
```
AI Video Editor/Raw/[Project Name]/
├── a-roll/             Primary talking head or unedited camera footage
├── b-roll/             Supporting product shots, screen captures, mockups
├── assets/             Project-specific logos, sound fx, custom graphics
├── transcripts/        Whisper-generated word-level timestamp transcript (.json)
├── notes.json          Beat-by-beat storyboard, visual directions, approvals
└── README.md           Project overview and target platform specs
```

## notes.json Spec
Contains the storyboard beats, speech segments, visual directions, asset references, and creator approval state (Approved, Rejected, Needs Revision).

