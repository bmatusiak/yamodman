import * as bootstrap from 'bootstrap'
import 'bootstrap/scss/bootstrap.scss'


import navbar from './components/navbar'
import themeSwitcher from './components/themeSwitcher';

setup.consumes = [];
setup.provides = ['bootstrap'];

export default function setup(imports, register) {
    //console.log('bootstrap');
    register(null, { 
        bootstrap: {
            bs: bootstrap,
            navbar,
            themeSwitcher
        }
    });
}

