/**
 * Kun Like 桌宠 · Electron preload
 * 通过 contextBridge 暴露给渲染进程的最小 API
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('petAPI', {
  // 移动整个窗口（拖动桌宠）
  moveWindow: (dx, dy) => ipcRenderer.send('pet-move', dx, dy),
  // 主进程通知打开设置面板
  onOpenSettings: (cb) => {
    ipcRenderer.on('open-settings', () => cb())
  },
})
