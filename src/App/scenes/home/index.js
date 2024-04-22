
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
            <bootstrap.themeSwitcher />
            <main className="container">
                <div className="bg-body-tertiary p-5 rounded">
                    <h1>Navbar example</h1>
                    <p className="lead">This example is a quick exercise to illustrate how fixed to top navbar works. As you scroll, it will remain fixed to the top of your browser’s viewport.</p>
                    <a className="btn btn-lg btn-primary" href="/docs/5.3/components/navbar/" role="button">View navbar docs &raquo;</a>
                </div>
            </main>
        </>);
    })
    
}


