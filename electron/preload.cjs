// =============================================================================
// GlowFit AI / RIIQX — Electron Preload Bridge
// Secure Context Bridge for Native Desktop Features (Hardware FFmpeg, Filesystem, Notifications)
// =============================================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('riiqxDesktop', {
  isElectron: true,
  platform: process.platform,
  version: '2.5.0',
  openExternal: (url) => ipcRenderer.invoke('riiqx:open-external', url),
  openFolder: (subDir) => ipcRenderer.invoke('riiqx:open-folder', subDir),
  selectFile: (options) => ipcRenderer.invoke('riiqx:select-file', options),
  scanClipboard: () => ipcRenderer.invoke('riiqx:scan-clipboard'),
  probeMedia: (filePath) => ipcRenderer.invoke('riiqx:probe-media', filePath),
  showNotification: (payload) => ipcRenderer.invoke('riiqx:notify', payload),
  onClipboardProduct: (callback) => {
    ipcRenderer.on('clipboard-product-detected', (_event, data) => callback(data));
  },
});

// Backward compatibility alias
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  openExternal: (url) => ipcRenderer.invoke('riiqx:open-external', url),
});
