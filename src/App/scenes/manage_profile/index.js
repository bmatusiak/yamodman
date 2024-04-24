import React, { useState } from 'react';

setup.consumes = ['scenes', 'config', 'bootstrap', 'utility'];
setup.provides = [];

export default function setup(imports, register) {
    const scenes = imports.scenes;
    const bootstrap = imports.bootstrap;

    scenes.add('manage_profile', function manage_profile(props) {

        var { profile, item } = props.data;

        var scene_components = [
            require('./components/start_modded').default(props.data, imports),
            require('./components/start_vanilla').default(props.data, imports),
            require('./components/installed').default(props.data, imports),
            require('./components/online').default(props.data, imports),
            require('./components/config_editor').default(props.data, imports),
            require('./components/settings').default(props.data, imports),
            require('./components/help').default(props.data, imports)
        ]

        var [selected_component, set_selected_component] = useState('installed');

        function NavElement(props) {
            var { part } = props;
            return (<li className="nav-item" onClick={() => {
                set_selected_component(part.id)
            }}>
                <a className="nav-link d-flex align-items-center gap-2 " href="#" >
                    <svg className="bi"><use xlinkHref={'#' + part.icon} /></svg>
                    {part.title}
                    {part.pill ? part.pill() : ''}
                </a>
            </li>)
        }

        function list(catagory) {
            return scene_components.map((part, index) => {
                if (part.catagory == catagory) {
                    return <NavElement key={index} part={part} />;
                }
            })
        }

        return (<>
            <bootstrap.navbar title="Manage Profile" back_title="Back" sub_title={profile} back_action={() => {
                scenes.back();
            }} />
            <div className="container-fluid">
                <div className="row text-nowrap">
                    <div className="border border-right  col-md-3 col-sm-12">
                        <div className="sticky-top nav flex-column">
                            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                                <span>{item.name}</span>
                            </h6>

                            <ul className="nav flex-column mb-auto"> {list('game')} </ul>
                            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                                <span>Mods</span>
                            </h6>
                            <ul className="nav flex-column mb-auto"> {list('mods')} </ul>

                            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                                <span>Other</span>
                            </h6>
                            <ul className="nav flex-column mb-auto"> {list('other')} </ul>
                        </div>
                    </div>

                    <main className=" m-0 p-0  col-sm-12 col-md-9">
                        {
                            scene_components.map((part, index) => {
                                if (part.id == selected_component) {
                                    return (<part.component key={index} />);
                                }
                            })
                        }
                    </main>
                </div>
            </div>
        </>);
    });

    register(null);
}
