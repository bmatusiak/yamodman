
import React from 'react';

setup.consumes = ['scenes', 'config', 'bootstrap'];
setup.provides = [];

export default function setup(imports, register) {

    const { scenes } = imports;
    scenes.add('home', function home(props) {
        const { bootstrap } = imports;
        return (<>
            <bootstrap.navbar />
            <main className="container">
                Empty Page (Home) {JSON.stringify(props)}
            </main>
        </>);
    })

    register(null);
}


