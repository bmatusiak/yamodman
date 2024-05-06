import React, { useState, useEffect } from 'react';

import Navbar from './elements/navbar';
import events from 'events';

const EventListenter = events.EventEmitter;

export default function (profileData, imports) {
    var { getDirectories, yaml } = imports.utility;
    var emitter = new EventListenter();
    var { profile, item, profile_path } = profileData;
    return {
        id: 'installed',
        catagory: 'mods',
        title: 'Installed',
        icon: 'folder-fill',
        pill: function (props) {
            return (null);
            // return (<span className="badge rounded-pill text-bg-success">5</span>)
        },
        component: function component(props) {

            var [plugins_list, set_plugins_list] = useState([]);

            useEffect(() => {
                //load

                (async () => {
                    try {
                        set_plugins_list(await getDirectories(profile_path + '\\BepInEx\\plugins'));
                        console.log(await yaml.read(profile_path + '\\mods.yml'));
                    } catch (e) { e; }
                })();

                return () => {
                    //unload
                }
            }, [])

            const PluginButton = (props) => (<div className=' pt-2'>
                <button className='btn btn-outline-primary w-100 overflow-hidden' onClick={props.onClick}>{props.text}</button>
            </div>);

            return (<>
                <Navbar />
                <div className='container-fluid py-4'>
                    {plugins_list.map((plugin, index) => {
                        return (
                            <div key={index} className='border p-3 my-2'>
                                <div className="d-inline-flex gap-2 w-100 align-items-center">
                                    <div data-bs-toggle="collapse" data-bs-target={'#' + plugin}>
                                        <img className='placeholder' style={{ width: 50, height: 50 }} />
                                    </div>
                                    <div className='' data-bs-toggle="collapse" data-bs-target={'#' + plugin}>
                                        <span className="badge rounded-pill text-bg-warning">DISABLED</span>
                                    </div>
                                    <div className='flex-grow-1 overflow-hidden' data-bs-toggle="collapse" data-bs-target={'#' + plugin}>
                                        {plugin}
                                    </div>
                                    <div className='d-inline-flex gap-2 px-2'>
                                        <svg className="bi"><use xlinkHref="#heart-fill" /></svg>
                                        <svg className="bi"><use xlinkHref="#exclamation-triangle-fill" /></svg>
                                    </div>
                                    <div className=''>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                        </div>
                                    </div>
                                    <div className='' data-bs-toggle="collapse" data-bs-target={'#' + plugin}>
                                        <svg className="bi"><use xlinkHref="#caret-right-fill" /></svg>
                                    </div>
                                </div>
                                <div className="collapse" id={plugin}>
                                    <div className='m-2 text-wrap'>
                                        Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
                                    </div>
                                    <div className="container-fluid">
                                        <div className="row row-cols-3 row-cols-sm-3 row-cols-md-6">
                                            <PluginButton text="Uninstall" onClick={() => { }} />
                                            <PluginButton text="Disable" onClick={() => { }} />
                                            <PluginButton text="Associated" onClick={() => { }} />
                                            <PluginButton text="Website" onClick={() => { }} />
                                            <PluginButton text="Donate" onClick={() => { }} />
                                            <PluginButton text="Enable Deps" onClick={() => { }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>);

        }
    }
}
