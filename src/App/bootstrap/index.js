
import $ from 'jquery';

import * as bootstrap from 'bootstrap'
import './index.scss'

import bootstrapSVG from 'bootstrap-icons/bootstrap-icons.svg'

import navbar from './components/navbar'

setup.consumes = ['config'];
setup.provides = ['bootstrap'];

export default function setup(imports, register) {
    
    var default_color_mode = (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    var config = imports.config('theme', {
        mode: default_color_mode
    })

    if ($('#bootstrap-icon-svg').length == 0)
        $(bootstrapSVG)
            .attr('id', 'bootstrap-icon-svg')
            .attr('class', 'd-none')
            .prependTo(document.body)


    var themeSwitcher = function () {
        var newMode = $('body').attr('data-bs-theme') == 'dark' ? 'light' : 'dark';
        $('body').attr('data-bs-theme', newMode);
        config.mode = newMode;
    }
    
    $('body').attr('data-bs-theme', config.mode);

    register(null, {

        bootstrap: {
            bs: bootstrap,
            navbar: navbar(themeSwitcher),
            themeSwitcher
        }
    });
}

