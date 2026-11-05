// =============================================================================
// GlowFit AI / RIIQX — Electron Preload Bridge
// Secure Context Bridge for Native Desktop Features
// =============================================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  openExternal: (url) => ipcRenderer.send('open-external', url),
});
