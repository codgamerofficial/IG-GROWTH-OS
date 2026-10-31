// =============================================================================
// RIIQX Creator Studio — Export Engine
// Standard Platform Packaging • 1080x1920 MP4/WebM Formatting • Metadata Ingestion
// =============================================================================

export interface ExportPackageOptions {
  projectName: string;
  blobUrl: string;
  extension: 'mp4' | 'webm' | 'png';
  title?: string;
  caption?: string;
}

export function generateExportFilename(projectName: string, extension: string): string {
  const cleanName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .slice(0, 40);
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `riiqx_${cleanName}_${timestamp}.${extension}`;
}

export function triggerBrowserDownload(blobUrl: string, filename: string): void {
  if (typeof window === 'undefined') return;
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

