// =============================================================================
// RIIQX — Video Editor Logical & Physical Workspace Management API
// Manages AI Video Editor/ directory structure, project files, and assets
// =============================================================================

import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export async function GET() {
  const rootWorkspace = path.join(process.cwd(), 'AI Video Editor');

  const scanDir = (dirPath: string): any[] => {
    if (!fs.existsSync(dirPath)) return [];
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      return items.map((item) => {
        const fullPath = path.join(dirPath, item.name);
        const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
        if (item.isDirectory()) {
          return {
            name: item.name,
            type: 'directory',
            path: relPath,
            children: scanDir(fullPath),
          };
        } else {
          const stats = fs.statSync(fullPath);
          return {
            name: item.name,
            type: 'file',
            path: relPath,
            sizeBytes: stats.size,
            updatedAt: stats.mtime.toISOString(),
          };
        }
      });
    } catch {
      return [];
    }
  };

  const tree = scanDir(rootWorkspace);

  // Read current style-sheet.md and brand-guidelines.json if present
  let styleSheetContent: string | null = null;
  let brandGuidelines: any = null;

  const styleSheetPath = path.join(rootWorkspace, 'styles', 'style-sheet.md');
  if (fs.existsSync(styleSheetPath)) {
    styleSheetContent = fs.readFileSync(styleSheetPath, 'utf-8');
  }

  const brandGuidelinesPath = path.join(rootWorkspace, 'styles', 'brand-guidelines.json');
  if (fs.existsSync(brandGuidelinesPath)) {
    try {
      brandGuidelines = JSON.parse(fs.readFileSync(brandGuidelinesPath, 'utf-8'));
    } catch {}
  }

  return NextResponse.json({
    success: true,
    workspacePath: 'AI Video Editor',
    tree,
    styleSheetContent,
    brandGuidelines,
    timestamp: new Date().toISOString(),
  });
}

