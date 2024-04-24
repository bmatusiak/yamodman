
import React from 'react';

setup.consumes = ['scenes', 'config', 'bootstrap'];
setup.provides = [];

export default function setup(imports, register) {

    register(null);
    const scenes = imports.scenes;
    const bootstrap = imports.bootstrap;

    scenes.add('home', function home() {
        return (<>
            <bootstrap.navbar />
            <main className="container">
                Empty Page (Home)
            </main>
        </>);
    })
    
}


