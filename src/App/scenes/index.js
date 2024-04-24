const default_scene = 'select_game'
import React from 'react';
scenes.config = [
    scenes,
    require('./home'),
    require('./change_data_dir'),
    require('./select_game'),
    require('./select_profile'),
    require('./manage_profile'),
];
scenes.consumes = ['config', 'session', 'react'];
scenes.provides = ['scenes'];
export default function scenes(imports, register) {
    var $scenes = {};
    const scenes = {
        config: imports.config('scenes', {
            startup: default_scene
        }),
        session: imports.session('scenes', {
            state_data: []
        }),
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
                    sceneName = scenes.config.startup
            }
            if (!sceneReloaded)
                scenes.session.state_data.push({ name: sceneName, data: data })

            scenes.session.save();

            var Scene = scenes.get(sceneName);
            if (Scene) 
                imports.react.root.render(<Scene data={data} />);
            //else //render fail
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
    register(null, { scenes });
}