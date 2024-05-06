const default_scene = 'select_game';

import React from 'react';
scenes.config = [
    scenes,
    require('./error'),
    // require('./home'),
    require('./settings'),
    require('./select_game'),
    require('./select_profile'),
    require('./manage_profile'),
];

scenes.consumes = ['app', 'config', 'session', 'react'];
scenes.provides = ['scenes'];
export default function scenes(imports, register) {
    var { app } = imports;
    var $scenes = {};
    const scenes = {
        add: function (sceneName, scene) {
            $scenes[sceneName] = scene;
        },
        get: function (sceneName) {
            return $scenes[sceneName];
        },
        load: function (sceneName, data) {
            var sceneReloaded = false;
            if (!sceneName) {
                if (scenes.session.state_data.length) {
                    var sceenData = scenes.session.state_data[scenes.session.state_data.length - 1];
                    sceneName = sceenData.name;
                    data = sceenData.data;
                    sceneReloaded = true;
                } else
                    return scenes.load(scenes.config.startup, data);
            }
            if (!sceneReloaded)
                scenes.session.state_data.push({ name: sceneName, data: data })

            scenes.session.save();

            var Scene = scenes.get(sceneName);
            if (Scene)
                imports.react.root.render(<Scene data={data} />);
            else{
                if(sceneName == scenes.config.startup && default_scene != scenes.config.startup){
                    return scenes.load(default_scene, data);
                }
            }
            //else //render fail scene
        },
        back: function () {
            var sceenData;
            if (scenes.session.state_data.length) {
                scenes.session.state_data.pop();//remove current scene
                sceenData = scenes.session.state_data[scenes.session.state_data.length - 1];
                scenes.session.save();
            }
            if (sceenData) {
                var Scene = scenes.get(sceenData.name);
                if (Scene)
                    imports.react.root.render(<Scene data={sceenData.data} />);
            }
        }
    };
    app.on('start', function () {
        scenes.config = imports.config('scenes', {
            startup: default_scene
        });
        scenes.session = imports.session('scenes', {
            state_data: []
        });
        var $ = require('jquery');
        $(() => {
            scenes.load();
        });
    })
    register(null, { scenes });
}