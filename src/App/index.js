import $ from 'jquery';

var scenes = require('./scenes').default;

main.config = []
    .concat(
        scenes.config, 
    [
        require('./config'),
        require('./react'),
        require('./bootstrap')
    ]);

export default function main(app) {
    $(() => {
        app.scenes.load(app.scenes.config.startup);
    });
}
