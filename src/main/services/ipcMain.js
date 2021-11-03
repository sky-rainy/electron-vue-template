import { ipcMain, dialog, BrowserWindow,session} from 'electron'
import Server from '../server/index'
import { winURL } from '../config/StaticPath'
const version = require('../../../package.json').version
export default {
  Mainfunc (mainWindow, IsUseSysTitle) {
    ipcMain.handle('IsUseSysTitle', async () => {
      return IsUseSysTitle
    })
    ipcMain.handle('version', async () => {
        return `版本信息：${version}\n\r引擎版本：${process.versions.v8}`;
    })
    ipcMain.handle('debug-devtools', (event, args) => {
      mainWindow.webContents.openDevTools(true)
    })
    ipcMain.handle('con-state-update-confirm', (event, args) => {
      mainWindow.webContents.send('con-state-update',args)
    })
    ipcMain.handle('windows-mini', (event, args) => {
      BrowserWindow.fromWebContents(event.sender)?.minimize()
    })
    ipcMain.handle('window-max', async (event, args) => {
      if (BrowserWindow.fromWebContents(event.sender)?.isMaximized()) {
        BrowserWindow.fromWebContents(event.sender)?.restore()
        return { status: false }
      } else {
        BrowserWindow.fromWebContents(event.sender)?.maximize()
        return { status: true }
      }
    })
    ipcMain.handle('window-close', (event, args) => {
      BrowserWindow.fromWebContents(event.sender)?.close()
    })
    ipcMain.handle('open-messagebox', async (event, arg) => {
      const res = await dialog.showMessageBox(mainWindow, {
        type: arg.type || 'info',
        title: arg.title || '',
        buttons: arg.buttons || [],
        message: arg.message || '',
        noLink: arg.noLink || true
      })
      return res
    })
    ipcMain.handle('open-errorbox', (event, arg) => {
      dialog.showErrorBox(
        arg.title,
        arg.message
      )
    })
    ipcMain.handle('statr-server', async () => {
      try {
        const serveStatus = await Server.StatrServer()
        console.log(serveStatus)
        return serveStatus
      } catch (error) {
        dialog.showErrorBox(
          '错误',
          error
        )
      }
    })
    ipcMain.handle('stop-server', async (event, arg) => {
      try {
        const serveStatus = await Server.StopServer()
        return serveStatus
      } catch (error) {
        dialog.showErrorBox(
          '错误',
          error
        )
      }
    })
    let ChildWin = null;
    let cidArray = [];
    ipcMain.handle('open-win', (event, arg) => {
      let cidjson = {id:null,url:''}
          //获取匹配的窗口ID
      let data = cidArray.filter((r)=>{
                if(r.url === arg.url){
                  return r
                }
             })
        if(data.length > 0){
          //获取当前窗口
          let w =  BrowserWindow.fromId(data[0].id)
          //聚焦窗口
              w.focus();
        }else{
          //获取主窗口ID
          let parentID = event.sender.id
          //创建窗口
          ChildWin = new BrowserWindow({
            height: arg?.height || 400 ,
            useContentSize: true,
            width: arg?.width || 300 ,
            autoHideMenuBar: true,
            resizable: arg?.resizable ?? false, //窗口大小是否可调整
            show: arg?.show ?? false,
            frame: IsUseSysTitle,
            maximizable:arg?.maximizable ?? true, //窗口是否可最大化
            opacity:1.0,  //窗口透明度
            parent:parentID,
            webPreferences: {
              webSecurity:false,
              nodeIntegration: true,
              webSecurity: false,
              webviewTag:arg?.webview ?? false,
              // 如果是开发模式可以使用devTools
              devTools: process.env.NODE_ENV === 'development',
              // 在macos中启用橡皮动画
              scrollBounce: process.platform === 'darwin',
              // 临时修复打开新窗口报错
              contextIsolation: false
            }
          })
          if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools(true)
          ChildWin.loadURL(winURL + `#${arg.url}`)
          cidjson.id = ChildWin?.id
          cidjson.url = arg.url
          cidArray.push(cidjson)
          ChildWin.webContents.once('dom-ready', () => {
            ChildWin.show()
            ChildWin.webContents.send('send-data', arg.sendData)
            if (arg.IsPay) {
              // 检查支付时候自动关闭小窗口
              const testUrl = setInterval(() => {
                const Url = ChildWin.webContents.getURL()
                if (Url.includes(arg.PayUrl)) {
                  ChildWin.close()
                }
              }, 1200)
              ChildWin.on('close', () => {
                clearInterval(testUrl)
              })
            }
          })
          ChildWin.on('closed',() => {
            ChildWin = null
            let index = cidArray.indexOf(cidjson)
            if (index > -1) {
              cidArray.splice(index, 1);
            } 
          })
        }
    })
  }
}
