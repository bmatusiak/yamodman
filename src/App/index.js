var scenes = require('./scenes').default;

export var core = require('./core/index').default;

export var config = []
    .concat(
        core,
        scenes.config,
        [
            //require('./tactics'),
            require('./games'),
            require('./thunderstore')
        ]);

export default config;
