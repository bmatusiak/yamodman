import $ from 'jquery';

var scenes = require('./scenes').default;

main.config = []
    .concat(
        scenes.config,
        [
            require('./storage'),
            require('./react'),
            require('./bootstrap'),
            require('./utility'),

            require('./games'),
            require('./thunderstore'),
 
        ]);

export default function main(app) {
    $(() => {
        app.scenes.load();
    });
}
