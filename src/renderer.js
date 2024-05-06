import app_config from './App/index';

import rectify from '@bmatusiak/rectify';

(() => {
    var app = rectify.build(app_config)
    app.start();
})();

