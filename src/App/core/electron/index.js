
setup.consumes = ['app'];
setup.provides = ['electron', 'ipc', 'appPackage'];

export default function setup(imports, register) {
    const electron = global.electron_app;
    const appPackage = require('../../../../package.json');//project package.json
    let ipc;
    if (typeof document == 'undefined') {
        //entry
        const { ipcMain } = electron;
        ipc = ipcMain;
        electron.__DEV__ = !electron.app.isPackaged;
        electron.isMain = true;
        ipcMain.handle('init', async () => {
            var client = {
                __DEV__: electron.__DEV__
            }
            return client;
        });
    } else {
        //render
        const { ipcRenderer } = electron;
        ipc = ipcRenderer;
        ipcRenderer.invoke('init').then(res => {
            for (var i in res) {
                electron[i] = res[i];
            }
            electron.isMain = false;
            imports.app.emit('start');
        })
        ipcRenderer.on('second-instance', function (evt, data) {
            console.log('second-instance', data);
            imports.app.emit('second-instance', data);
            var url = data.commandLine[data.commandLine.length - 1];
            if (typeof url == 'string' && url.indexOf('://') >= 0) {
                imports.app.emit('open-url', url);
            }
        });
        ipcRenderer.on('open-url', function (evt, data) {
            imports.app.emit('open-url', data);
        });
        ipcRenderer.on('open-protocal', function (evt, data) {
            imports.app.emit('open-protocal', data);
        });
    }


    if (ipc.handle) {
        ipc.handle('showOpenDialog', async (event, opts) => {
            return await electron.dialog.showOpenDialog(electron.mainWindow, opts);
        })
        ipc.handle('openPath', async (event, defaultPath) => {
            electron.shell.openPath(defaultPath);
        })
        ipc.handle('openExternal', async (event, defaultPath) => {
            electron.shell.openExternal(defaultPath);
        })
    } else {
        electron.showOpenDialog = function (opts) {
            return new Promise((resolve) => ipc.invoke('showOpenDialog', opts).then(resolve));
        }

        electron.openPath = function (opts) {
            return new Promise((resolve) => ipc.invoke('openPath', opts).then(resolve));
        }
        electron.openExternal = function (opts) {
            return new Promise((resolve) => ipc.invoke('openExternal', opts).then(resolve));
        }
    }

    return register(null, { ipc: ipc, electron, appPackage });
}
