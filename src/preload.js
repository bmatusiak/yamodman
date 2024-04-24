// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.invoke('DEV').then(res => {
        window.__DEV__ = res;
    })
})

window.nodejs = {};

window.nodejs.https = require('https', !0);
