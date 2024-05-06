
import React, { useEffect, useRef, useState } from 'react';

setup.consumes = ['scenes', 'config', 'bootstrap', 'settings', 'utility', '$'];
setup.provides = [];

export default function setup(imports, register) {

    register(null);
    const scenes = imports.scenes;
    const bootstrap = imports.bootstrap;
    const $ = imports.$;
    const settings = imports.settings;
    const { getDirectories, fs } = imports.utility;

    scenes.add('select_profile', function select_profile(props) {
        var item = props.data;
        var gameName = item.game.name;

        var config = imports.config('select_game', {
            lastGameName: '',
            lastSelectedProfile: ''
        })

        if (config.lastGameName != gameName) {
            config.lastGameName = gameName;
            config.lastSelectedProfile = '';
        }

        var [selected_profile, set_selected_profile] = useState(config.lastSelectedProfile);
        var [openDialog, set_openDialog] = useState(null);

        if (selected_profile != config.lastSelectedProfile)
            config.lastSelectedProfile = selected_profile;

        var [profiles_list, set_profiles_list] = useState([]);
        var profiles_path = settings.data_dir + '\\' + item.game.name + '\\profiles';

        fs.mkdirSync(profiles_path, { recursive: true });

        useEffect(() => {
            (async () => {
                set_profiles_list(await getDirectories(profiles_path));
            })();
        }, [])

        const SelectProfileButton = () => (<button className='btn btn-primary' onClick={() => {
            if (selected_profile)
                scenes.load('manage_profile', {
                    profile: selected_profile,
                    item,
                    profile_path: profiles_path + '\\' + selected_profile
                });
        }}>&nbsp;Select Profile&nbsp;</button>);

        function RenameProfileDialog(props) {
            var inputRef = useRef(null);
            async function onSubmit() {
                var profileName = inputRef.current.value
                fs.renameSync(profiles_path + '\\' + selected_profile, profiles_path + '\\' + profileName)
                set_selected_profile(profileName);
                set_profiles_list(await getDirectories(profiles_path));
                set_openDialog(null);
            }
            return (<bootstrap.dialog
                title={'Rename Profile - ' + selected_profile}
                onClose={() => { set_openDialog(null) }}
                isOpen={openDialog == 'rename'}
            >
                <p>This profile will store its own mods independently from other profiles.</p>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                    <div className="mb-3">
                        <label htmlFor="recipient-name" className="col-form-label">New Profile Name:</label>
                        <input ref={inputRef} type="text" className="form-control" id="recipient-name" />
                    </div>
                </form>
                <button className="btn btn-danger" onClick={() => {
                    onSubmit();
                }}>Create</button>
            </bootstrap.dialog >);
        }
        RenameProfileDialog.button = () => (<button className='btn btn-outline-primary' onClick={() => {
            set_openDialog('rename')
        }}>&nbsp;Rename&nbsp;</button>);

        function CreateProfileDialog(props) {
            var inputRef = useRef(null);
            async function onSubmit() {
                var profileName = inputRef.current.value
                fs.mkdirSync(profiles_path + '\\' + profileName);
                set_selected_profile(profileName);
                set_profiles_list(await getDirectories(profiles_path));
                set_openDialog(null);
            }
            return (<bootstrap.dialog
                title="Create Profile"
                onClose={() => { set_openDialog(null) }}
                isOpen={openDialog == 'create'}
            >
                <p>This profile will store its own mods independently from other profiles.</p>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                    <div className="mb-3">
                        <label htmlFor="recipient-name" className="col-form-label">New Profile Name:</label>
                        <input ref={inputRef} type="text" className="form-control" id="recipient-name" />
                    </div>
                </form>
                <button className="btn btn-danger" onClick={() => {
                    onSubmit();
                }}>Create</button>
            </bootstrap.dialog >);
        }
        CreateProfileDialog.button = () => (<button className='btn btn-outline-primary' onClick={() => {
            set_openDialog('create')
        }}>&nbsp;Create New&nbsp;</button>);

        function DeleteProfileDialog(props) {
            var inputRef = useRef(null);
            async function onSubmit() {
                var profileName = inputRef.current.value
                if (selected_profile == profileName) {
                    fs.rmSync(profiles_path + '\\' + selected_profile, { recursive: true, force: true });
                    set_selected_profile(null);
                    set_profiles_list(await getDirectories(profiles_path));
                    set_openDialog(null);
                } else {
                    $(inputRef.current).addClass('is-invalid')
                }
            }
            return (<bootstrap.dialog
                title={'Delete Profile - ' + selected_profile}
                onClose={() => { set_openDialog(null) }}
                isOpen={openDialog == 'delete'}
            >
                <p>This will remove all mods, and their config files, installed within this profile.<br />
                    If this was an accident, or the cross inside this dialog located in the top right corner.<br />
                    If you are sure you&apos;d like to delete this profile, type profile name?</p>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                    <div className="mb-3">
                        <label htmlFor="recipient-name" className="col-form-label">Confirm Profile Name:</label>
                        <input ref={inputRef} type="text" className="form-control" id="recipient-name" />
                    </div>
                </form>
                <button className="btn btn-danger" onClick={() => {
                    onSubmit();
                }}>Delete</button>
            </bootstrap.dialog >);
        }
        DeleteProfileDialog.button = () => (<button className='btn btn-danger' onClick={() => {
            set_openDialog('delete')
        }}>&nbsp;Delete&nbsp;</button>);

        return (<>
            <style>{`
                .text-pointer {
                    cursor:pointer;
                }
            `}</style>
            <bootstrap.navbar title={item.name} back_title="Back" back_action={() => {
                scenes.back();
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
                                        if(selected_profile == item) return set_selected_profile(null);
                                        set_selected_profile(item);
                                    }} >
                                    <div className={(selected_profile == item ? ' fw-bold' : '')} >{(selected_profile == item ? '-> ' : '')}{item}</div>
                                </td>
                            </tr>)
                        })}
                    </tbody>
                </table>
                <table className="table sticky-bottom">
                    <tbody>
                        <tr>
                            {selected_profile ? (<td className='text-center'>
                                <SelectProfileButton />
                            </td>) : null}

                            {selected_profile ? (<td className='text-center'>
                                <RenameProfileDialog.button />
                            </td>) : null}

                            <td className='text-center'>
                                <CreateProfileDialog.button />
                            </td>
                            {/* <td className='text-center'>
                                <button className='btn btn-outline-primary'>&nbsp;Import / Update&nbsp;</button>
                            </td> */}


                            {selected_profile ? (<td className='text-center'>
                                <DeleteProfileDialog.button />
                            </td>) : null}

                        </tr>
                    </tbody>
                </table>
            </main>
            <RenameProfileDialog />
            <CreateProfileDialog />
            <DeleteProfileDialog />
        </>);
    })

}
