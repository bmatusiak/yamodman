global.electron_app = require('electron');
var packageInfo = require('../package.json');
const path = require('node:path');
const { app, BrowserWindow, protocol } = require('electron');
const __DEV__ = !app.isPackaged;

import app_config from './App/index';
import rectify from '@bmatusiak/rectify';

if (require('electron-squirrel-startup')) {
  app.quit();
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(packageInfo.name, process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient(packageInfo.name)
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit()
} else {
  const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        nodeIntegration: true, contextIsolation: false,
        // eslint-disable-next-line no-undef
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        devTools: __DEV__,
        // securityOptions: {
        //   // eslint-disable-next-line quotes
        //   contentSecurityPolicy: "img-src 'self' blob:; default-src 'self' https://*; script-src 'self' https://*; style-src 'self' https://*; font-src 'self' https://*; object-src 'none'"
        // }
      },
    });
    (() => {
      global.electron_app.mainWindow = mainWindow;
      var app_core = rectify.build(app_config);
      app_core.start(function () {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
          restore_and_focus(mainWindow);
          mainWindow.webContents.send('second-instance', { commandLine, workingDirectory });
        });
        app.on('open-url', (event, url) => {
          restore_and_focus(mainWindow);
          mainWindow.webContents.send('open-url', url);
        });
        protocol.handle(packageInfo.name, (request) => {
          restore_and_focus(mainWindow);
          mainWindow.webContents.send('open-protocal', request.url);
        });
        // eslint-disable-next-line no-undef
        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
        if (__DEV__) {
          mainWindow.webContents.openDevTools();
        } else
          mainWindow.removeMenu();
        //require('./menu_setup')(__DEV__);
      });
    })();
  };
  app.on('ready', createWindow);
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}

function restore_and_focus(w) {
  if (w) {
    if (w.isMinimized()) w.restore()
    w.focus()
  }
}