
import React from 'react';

setup.consumes = ['scenes', 'config', 'bootstrap'];
setup.provides = ['data_dir'];

export default function setup(imports, register) {
    //https://getbootstrap.com/docs/5.3/examples/dashboard/
    const scenes = imports.scenes;
    const bootstrap = imports.bootstrap;

    scenes.add('change_data_dir', function change_data_dir() {
        return (<>
            <bootstrap.navbar title="Change Data Directory" back_title="Select Game" back_action={() => {
                scenes.load('select_game')
            }} />
            <main className="container">
                <div>

                </div>
                <input type="file" webkitdirectory="" />
            </main>
        </>);
    })

    register(null, {
        data_dir: imports.config('data_dir', {
            path: process.env.APPDATA + '\\' + 'r2modmanPlus-local'
        })
    });
}


