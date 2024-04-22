
import React from 'react';

scenes.config = [
    scenes,
    require('./home'),
];
scenes.consumes = ['config', 'react'];
scenes.provides = ['scenes'];
export default function scenes(imports, register) {

    var $scenes = {};

    const scenes = {
        config: imports.config('scenes', {
            startup: 'home'
        }),
        add: function (sceneName, scene) {
            $scenes[sceneName] = scene;
        },
        get: function (sceneName) {
            return $scenes[sceneName];
        },
        load: function (sceneName) {
            var Scene = scenes.get(sceneName);
            imports.react.root.render(<Scene />);
        }
    };

    register(null, { scenes });


}