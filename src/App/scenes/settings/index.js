
import React, { useState } from 'react';

setup.consumes = ['scenes', 'config', 'bootstrap', 'ipc', 'electron'];
setup.provides = ['settings'];

export default function setup(imports, register) {

    const scenes = imports.scenes;
    const bootstrap = imports.bootstrap;
    const settings = imports.config('settings', {
        data_dir: process.env.APPDATA + '\\' + 'r2modmanPlus-local'
    })


    settings.view = function View(props) {
        var [, updateState] = useState(0);
        return (<main className="container-fluid">
            <div className='row gap-2 px-2'>
                <div>
                    {settings.data_dir}
                </div>
                <button type="file" className='btn btn-danger' onClick={(event) => {
                    event.preventDefault();
                    imports.electron.showOpenDialog({
                        properties: ['openDirectory'],
                        defaultPath: settings.data_dir
                    }).then(res => {
                        if (res) {
                            settings.data_dir = res.filePaths[0];
                            updateState(new Date().getTime())
                        }
                    })
                }} >Select Directory</button>
                <button className='btn btn-warning' onClick={(event) => {
                    event.preventDefault();
                    imports.electron.openPath(settings.data_dir);
                }} >Open</button>
            </div>

            <hr />
        </main>);
    };

    scenes.add('settings', function settings_scene() {
        return (<>
            <bootstrap.navbar title="App Settings" back_title="Select Game" back_action={() => {
                scenes.load('select_game')
            }} />
            <settings.view />
        </>);
    })


    register(null, {
        settings
    });
}
