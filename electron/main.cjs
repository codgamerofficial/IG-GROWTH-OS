// =============================================================================
// GlowFit AI / RIIQX — Desktop Native Electron Shell
// High-Performance Hardware Accelerated Desktop Window for Video & Dropshipping OS
// Phase 8: Local Hardware FFmpeg • Native Filesystem • Global Hotkeys • Clipboard Scanner
// =============================================================================

const { app, BrowserWindow, shell, ipcMain, dialog, clipboard, globalShortcut, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');

// Enable GPU hardware acceleration & zero-copy video pipelines
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');

let mainWindow = null;

const ROOT_DIR = path.resolve(__dirname, '..');
const VIDEO_EDITOR_DIR = path.join(ROOT_DIR, 'AI Video Editor');

function resolveFfmpegPath() {
  const isWin = process.platform === 'win32';
  const arch = process.arch === 'x64' ? 'x64' : 'ia32';
  const binName = isWin ? 'ffmpeg.exe' : 'ffmpeg';
  const localPath = path.join(ROOT_DIR, 'node_modules', '@ffmpeg-installer', `${process.platform}-${arch}`, binName);
  return fs.existsSync(localPath) ? localPath : binName;
}

function resolveFfprobePath() {
  const isWin = process.platform === 'win32';
  const arch = process.arch === 'x64' ? 'x64' : 'ia32';
  const binName = isWin ? 'ffprobe.exe' : 'ffprobe';
  const localPath = path.join(ROOT_DIR, 'node_modules', '@ffprobe-installer', `${process.platform}-${arch}`, binName);
  return fs.existsSync(localPath) ? localPath : binName;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 720,
    title: 'RIIQX — Ultimate Commerce Intelligence & AI Creator OS',
    backgroundColor: '#0C0C0E',
    darkTheme: true,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      spellcheck: false,
    },
  });

  const devUrl = process.env.ELECTRON_START_URL || 'http://localhost:3001';
  mainWindow.loadURL(devUrl);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Open external shopping & wallet URLs in the default OS browser
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// -----------------------------------------------------------------------------
// IPC Handlers: Native Filesystem, Hardware FFmpeg, and System Features
// -----------------------------------------------------------------------------

function registerIpcHandlers() {
  // 1. Open Native Windows Explorer to Project Directories
  ipcMain.handle('riiqx:open-folder', async (_event, subDir = '') => {
    const targetPath = path.join(VIDEO_EDITOR_DIR, subDir);
    if (fs.existsSync(targetPath)) {
      shell.openPath(targetPath);
      return { success: true, path: targetPath };
    }
    return { success: false, error: `Folder not found: ${targetPath}` };
  });

  // 2. Open External Link in System Browser
  ipcMain.handle('riiqx:open-external', async (_event, url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      await shell.openExternal(url);
      return { success: true };
    }
    return { success: false, error: 'Invalid URL' };
  });

  // 3. Native File Picker Dialog
  ipcMain.handle('riiqx:select-file', async (_event, options = {}) => {
    if (!mainWindow) return { canceled: true };
    const result = await dialog.showOpenDialog(mainWindow, {
      title: options.title || 'Select Media File',
      filters: options.filters || [
        { name: 'Video & Image Files', extensions: ['mp4', 'mov', 'webm', 'png', 'jpg', 'jpeg'] },
      ],
      properties: options.multi ? ['openFile', 'multiSelections'] : ['openFile'],
    });
    return result;
  });

  // 4. Clipboard URL Scanner for E-Commerce Product Links
  ipcMain.handle('riiqx:scan-clipboard', async () => {
    const text = clipboard.readText().trim();
    const isShoppingUrl = /(amazon|flipkart|myntra|ajio|meesho|tatacliq|nykaa)\.[a-z.]+/i.test(text);
    return {
      hasShoppingUrl: isShoppingUrl,
      url: isShoppingUrl ? text : null,
      rawText: text.slice(0, 200),
    };
  });

  // 5. Hardware-Accelerated Local Media Probe (FFprobe)
  ipcMain.handle('riiqx:probe-media', async (_event, relativeOrAbsPath) => {
    const filePath = path.isAbsolute(relativeOrAbsPath)
      ? relativeOrAbsPath
      : path.join(ROOT_DIR, relativeOrAbsPath);

    if (!fs.existsSync(filePath)) {
      return { success: false, error: `File not found on disk: ${filePath}` };
    }

    const ffprobePath = resolveFfprobePath();
    return new Promise((resolve) => {
      execFile(
        ffprobePath,
        ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', filePath],
        (err, stdout) => {
          if (err) {
            return resolve({ success: false, error: err.message });
          }
          try {
            const data = JSON.parse(stdout);
            const vStream = data.streams?.find((s) => s.codec_type === 'video');
            const aStream = data.streams?.find((s) => s.codec_type === 'audio');
            return resolve({
              success: true,
              filePath,
              width: vStream?.width || 0,
              height: vStream?.height || 0,
              durationSeconds: Number(data.format?.duration || 0),
              fps: vStream?.r_frame_rate || '30/1',
              videoCodec: vStream?.codec_name || 'unknown',
              hasAudio: Boolean(aStream),
              fileSizeBytes: Number(data.format?.size || 0),
            });
          } catch (parseErr) {
            return resolve({ success: false, error: parseErr.message });
          }
        }
      );
    });
  });

  // 6. Native Windows Notifications
  ipcMain.handle('riiqx:notify', async (_event, { title, body }) => {
    if (Notification.isSupported()) {
      new Notification({
        title: title || 'RIIQX Intelligence',
        body: body || 'Operation completed.',
        icon: path.join(ROOT_DIR, 'public', 'icons', 'icon-512x512.png'),
      }).show();
      return { success: true };
    }
    return { success: false, error: 'Notifications not supported' };
  });
}

// -----------------------------------------------------------------------------
// Global Hotkey Registration
// -----------------------------------------------------------------------------

function registerGlobalHotkeys() {
  // CommandOrControl+Shift+S -> Quick scan clipboard for product link
  try {
    globalShortcut.register('CommandOrControl+Shift+S', () => {
      const text = clipboard.readText().trim();
      const isShoppingUrl = /(amazon|flipkart|myntra|ajio|meesho|tatacliq|nykaa)\.[a-z.]+/i.test(text);

      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();

        if (isShoppingUrl) {
          mainWindow.webContents.send('clipboard-product-detected', {
            url: text,
            timestamp: Date.now(),
          });

          if (Notification.isSupported()) {
            new Notification({
              title: 'RIIQX Price Arbitrage Scanner',
              body: `Detected product link in clipboard: ${text.slice(0, 45)}... Analyzing!`,
            }).show();
          }
        }
      }
    });
  } catch (err) {
    console.warn('[Electron] Global shortcut registration warning:', err.message);
  }
}

// -----------------------------------------------------------------------------
// App Lifecycle
// -----------------------------------------------------------------------------

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  registerGlobalHotkeys();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
