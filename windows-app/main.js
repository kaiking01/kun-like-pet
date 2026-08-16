/**
 * Kun Like 桌宠 · Electron 主进程
 * 透明无边框置顶悬浮窗 + 系统托盘 + 窗口拖动
 */
const { app, BrowserWindow, Tray, Menu, ipcMain, screen, nativeImage } = require('electron')
const path = require('path')

let win = null
let tray = null
let quitting = false

function createWindow() {
  const area = screen.getPrimaryDisplay().workArea
  win = new BrowserWindow({
    width: 280,
    height: 240,
    x: area.x + area.width - 300,
    y: area.y + area.height - 260,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  win.setAlwaysOnTop(true, 'screen-saver')
  win.loadFile(app.isPackaged
    ? path.join(process.resourcesPath, 'index.html')
    : path.join(__dirname, '..', 'index.html'))
  win.on('closed', () => { win = null })
}

function createTray() {
  // 用 16x16 的圆形奶猫图标（纯 nativeImage 绘制，避免依赖图标文件）
  const icon = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVR4nGNgGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCkbBKBgFgwoAAEcABEGB1F8JAAAAAElFTkSuQmCC'
  )
  tray = new Tray(icon)
  tray.setToolTip('Kun Like 桌宠 🐱')
  const menu = Menu.buildFromTemplate([
    {
      label: '🐱 显示 / 隐藏猫咪',
      click: () => {
        if (!win) return
        if (win.isVisible()) win.hide()
        else win.show()
      },
    },
    { label: '⚙ 打开设置', click: () => { if (win) { win.show(); win.webContents.send('open-settings') } } },
    { type: 'separator' },
    { label: '🚪 退出', click: () => { quitting = true; app.quit() } },
  ])
  tray.setContextMenu(menu)
  tray.on('click', () => { if (win) { win.isVisible() ? win.hide() : win.show() } })
}

// 渲染进程拖动窗口
ipcMain.on('pet-move', (e, dx, dy) => {
  if (!win) return
  const [x, y] = win.getPosition()
  const area = screen.getPrimaryDisplay().workArea
  win.setPosition(
    Math.min(Math.max(x + (dx | 0), area.x - 100), area.x + area.width - 100),
    Math.min(Math.max(y + (dy | 0), area.y - 100), area.y + area.height - 100)
  )
})

// 设置面板：让渲染进程收到通知后弹出设置
ipcMain.on('pet-settings-open', (e) => { /* 渲染进程直接处理 */ })

app.whenReady().then(() => {
  createWindow()
  createTray()
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})

// 托盘常驻：关闭窗口不退出程序
app.on('window-all-closed', () => {
  if (quitting) app.quit()
})
