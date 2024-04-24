
import React, { useEffect, useState } from 'react';

setup.consumes = ['scenes', 'config', 'bootstrap', 'data_dir'];
setup.provides = [];

export default function setup(imports, register) {

    register(null);
    const scenes = imports.scenes;
    const bootstrap = imports.bootstrap;
    const data_dir = imports.data_dir;

    scenes.add('select_profile', function select_profile(props) {
        var item = props.data;

        var [selected_profile, set_selected_profile] = useState('');

        var [profiles_list, set_profiles_list] = useState([]);
        var profiles_path = data_dir.path + '\\' + item.game.name + '\\profiles';

        useEffect(() => {
            //load

            (async () => {
                set_profiles_list(await getDirectories(profiles_path));
            })();

            return () => {
                //unload
            }
        }, [])


        return (<>
            <style>{`
                .text-pointer {
                    cursor:pointer;
                }
            `}</style>
            <bootstrap.navbar title={item.name} back_title="Back" back_action={() => {
                scenes.back();//('select_game')
            }} />
            <main className="container  pt-4">
                <h3>Select Profile</h3>
                <hr />
                <table className="table">
                    <tbody>
                        {profiles_list.map((item, index) => {
                            return (<tr key={index} className='border-bottom'>
                                <td className='p-2 text-pointer'
                                    onClick={() => {
                                        set_selected_profile(item);
                                    }} >
                                    <div className={(selected_profile == item ? ' fw-bold' : '')} >{item}</div>
                                </td>
                            </tr>)
                        })}
                    </tbody>
                </table>
                <table className="table sticky-bottom">
                    <tbody>
                        <tr>
                            <td className='text-center'>
                                <button className='btn btn-primary' onClick={() => {
                                    if (selected_profile)
                                        scenes.load('manage_profile', {
                                            profile: selected_profile,
                                            item,
                                            profile_path: profiles_path + '\\' + selected_profile
                                        });
                                }}>&nbsp;Select Profile&nbsp;</button>
                            </td>
                            {/* <td className='text-center'>
                                <button className='btn btn-outline-primary'>&nbsp;Rename&nbsp;</button>
                            </td>
                            <td className='text-center'>
                                <button className='btn btn-outline-primary'>&nbsp;Create New&nbsp;</button>
                            </td>
                            <td className='text-center'>
                                <button className='btn btn-outline-primary'>&nbsp;Import / Update&nbsp;</button>
                            </td>
                            <td className='text-center'>
                                <button className='btn btn-danger active'>&nbsp;Delete&nbsp;</button>
                            </td> */}
                        </tr>
                    </tbody>
                </table>
            </main>
        </>);
    })

}


const { readdir } = require('fs', !0)

const getDirectories = async (source) => new Promise((resolve, reject) => {
    readdir(source, { withFileTypes: true }, (err, files) => {
        if (err) {
            reject(err)
        } else {
            resolve(
                files
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name)
            )
        }
    })
});
