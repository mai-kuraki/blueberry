const { 
  app, 
  BrowserWindow, 
  ipcMain 
} = require('electron');
const {
  WIN_SEND_GLOBALCONFIG,
  WIN_COPY_TEMPLATE,
  WIN_OPEN_DEV,
  WIN_SCAN_PROJECT,
  WIN_WILL_CLOSE
} = require('./consts/event');
const funcs = require('./funcs');
const addDevToolsExtension = require('./funcs/addDevToolsExtension');
global.config =  {
  __baseDir: __dirname
}

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 600,
    frame: false,
    webPreferences: {
      devTools: true,
      nodeIntegration: true
    }
  });
  global.mainWindow = mainWindow;
  mainWindow.loadURL('http://127.0.0.1:3000');
  mainWindow.on('closed', function () {
    mainWindow = null;
  })
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send(WIN_SEND_GLOBALCONFIG, {
      __baseDir: __dirname
    })
  })
  mainWindow.webContents.openDevTools();
  addDevToolsExtension();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  mainWindow.webContents.send(WIN_WILL_CLOSE);
  if (process.platform !== 'darwin') app.quit();
})

app.on('activate', () => {
  if (mainWindow === null) createWindow();
})

ipcMain.on(WIN_COPY_TEMPLATE, funcs.copyTemplate);
ipcMain.on(WIN_OPEN_DEV, funcs.openDev);
ipcMain.on(WIN_SCAN_PROJECT, funcs.scanProject);