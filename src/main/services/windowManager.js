import { BrowserWindow, Menu,app } from 'electron'
import menuconfig from '../config/menu'
import { user32, windowcompositon }  from '../config/maoboli'
import config from '@config'
import setIpc from './ipcMain'
import upload from './checkupdate'
import DownloadUpdate from './downloadFile'
import { winURL, loadingURL } from '../config/StaticPath'

var loadWindow = null
var mainWindow = null

function createMainWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 650,
    useContentSize: true,
    width: 800,
    //minWidth: 1366,
    show: false,
    fullscreen: false,

    frame: config.IsUseSysTitle,
    titleBarStyle: 'default',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      webviewTag:true,
      webSecurity: false,
      // 如果是开发模式可以使用devTools
      devTools: true,
      // devTools: true,
      // 在macos中启用橡皮动画
      scrollBounce: true
    }
  })
  // 这里设置只有开发环境才注入显示开发者模式
  // if (process.env.NODE_ENV === 'development') {
    menuconfig.push({
      label: '开发者设置',
      submenu: [{
        label: '切换到开发者模式',
        accelerator: 'CmdOrCtrl+I',
        role: 'toggledevtools'
      }]
    })
  // }
  // 载入菜单
  const menu = Menu.buildFromTemplate(menuconfig)
  Menu.setApplicationMenu(menu)
  mainWindow.loadURL(winURL)

  setIpc.Mainfunc(mainWindow, config.IsUseSysTitle)
  upload.Update(mainWindow)
  DownloadUpdate.download(mainWindow)

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.show()
  })
  if (config.UseStartupChart) loadWindow.destroy()

  // if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools(true)

  mainWindow.on('closed', () => {
    app.quit();
  })
}

function loadingWindow () {
  loadWindow = new BrowserWindow({
    width: 85,
    height: 110,
    frame: false,  //无边框
    skipTaskbar: true,
    transparent: true, //透明
    resizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      experimentalFeatures: true,
      evTools: process.env.NODE_ENV === 'development',
    }
  })
 
  loadWindow.setAlwaysOnTop(true)
  //loadWindow.webContents.openDevTools(true)
  loadWindow.loadURL(loadingURL)
  loadWindow.show()

  // 设置窗口毛玻璃 注释掉就是无背景启动窗口
  const handle = loadWindow.getNativeWindowHandle();
  user32.SetWindowCompositionAttribute(
    handle.readInt32LE(),
    windowcompositon.ref()
  );

  setTimeout(() => {
    createMainWindow()
  }, 2000)

  loadWindow.on('closed', () => {
    loadWindow = null
  })
}

function initWindow () {
  if (config.UseStartupChart) {
    return loadingWindow()
  } else {
    return createMainWindow()
  }
}
export default initWindow
