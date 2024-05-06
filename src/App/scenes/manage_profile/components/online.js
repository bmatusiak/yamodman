
import React, { useEffect, useState, useRef } from 'react';


export default function (profile, imports) {
    var { thunderstore, utility, bootstrap } = imports;

    const itemsPerPage = 10;

    return {
        id: 'online',
        catagory: 'mods',
        title: 'Online',
        icon: 'globe',
        component: function component(props) {

            let view_data = []

            var [mods_list, set_mods_list] = useState([]);

            const catagories = buildCatagories(mods_list);
            const [selectedCatagories, set_selectedCatagories] = useState([]);
            const [filterOptions, setFilterOptions] = useState({
                nsfw: false,
                deprecated: false,
                mod_has_1: true,
                mad_has_all: false,
                mod_has_none: false
            });

            console.log(selectedCatagories)
            const [currentPage, setCurrentPage] = useState(1);
            const [searchTerm, setSearchTerm] = useState('');

            const filtered = mods_list.filter((mod) => {
                var latest_version = mod.versions[0];
                const searchText = searchTerm.toLowerCase(); // Make search case-insensitive
                return (
                    latest_version.description.toLowerCase().includes(searchText) ||
                    mod.full_name.toLowerCase().includes(searchText)
                );
            }).filter((mod) => {
                if (mod.has_nsfw_content && !filterOptions.nsfw) {
                    return false;
                }
                return true;
            }).filter((mod) => {
                if (mod.is_deprecated && !filterOptions.deprecated) {
                    return false;
                }
                return true;
            }).filter((mod) => {
                if (selectedCatagories.length == 0) return true;

                if (filterOptions.mod_has_1) {
                    for (var i in selectedCatagories) {
                        for (var j in mod.categories) {
                            if (mod.categories[j] == selectedCatagories[i]) {
                                return true;
                            }
                        }
                    }
                }
                if (filterOptions.mod_has_none) {
                    //
                }
                if (filterOptions.mod_has_all) {
                    //
                }
                return true;
            });

            console.log(filtered.length)

            const totalPages = Math.ceil(filtered.length / itemsPerPage);

            const handleCurrentPageChange = (newCurrentPage) => {
                if (newCurrentPage != currentPage)
                    setCurrentPage(newCurrentPage);
                const startIndex = (newCurrentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                view_data = filtered.slice(startIndex, endIndex); // Update displayed data
            };

            useEffect(() => {
                (async () => {
                    set_mods_list(await thunderstore.community_packages(profile.item.identifier));
                    setCurrentPage(1);
                })();
            }, [])

            handleCurrentPageChange(currentPage);

            const PluginButton = (props) => {
                var onClick = props.onClick;
                var cl = ' btn-outline-primary';
                if (!onClick) {
                    onClick = () => { };
                    cl = ' btn-outline-secondary';
                }
                return (<div className='col-12 col-sm-6 col-md-3 col-lg-2 col-xl-1 mt-2 '><button className={'btn w-100' + cl} onClick={onClick}>{props.text || props.children}</button></div>)
            };

            return (<>
                <ListNav {...{
                    setSearchTerm, setCurrentPage,
                    filterOptions, setFilterOptions,
                    catagories, selectedCatagories, addCat: (c) => {
                        var sc = [];
                        if (selectedCatagories.indexOf(c) >= 0) return;
                        selectedCatagories.forEach(i => sc.push(i))
                        sc.push(c)
                        set_selectedCatagories(sc);
                    }, removeCat: (c) => {
                        var sc = [];
                        if (selectedCatagories.indexOf(c) == -1) return;
                        selectedCatagories.forEach(i => {
                            if (i == c) return;
                            sc.push(i)
                        })
                        set_selectedCatagories(sc);
                    }
                }} />
                <div className='container py-4'>
                    {view_data.map((item, index) => {
                        console.log(item)
                        var plugin = item.full_name
                        var latest_version = item.versions[0];
                        let totalDownloads = 0;
                        item.versions.forEach(version => totalDownloads += version.downloads);
                        
                        var cats = '[ '+item.categories.join(', ')+' ]';
                        if(item.categories.length == 0)
                        cats = '[ No Catagories ]';
                        return (
                            <div key={plugin} className='border p-3 my-2'>
                                <div className="d-inline-flex gap-2 w-100 align-items-center">
                                    <div data-bs-toggle="collapse" data-bs-target={'#' + plugin}>
                                        <utility.image style={{ width: 50, height: 50 }} src={latest_version.icon} />
                                    </div>
                                    <div className='' data-bs-toggle="collapse" data-bs-target={'#' + plugin}>
                                        {item.is_pinned ? (<span className="badge rounded-pill text-bg-warning">PINNED</span>) : (null)}
                                    </div>
                                    <div className='flex-grow-1 overflow-hidden' data-bs-toggle="collapse" data-bs-target={'#' + plugin}>
                                        {item.name} <span className='text-secondary'>by {item.owner}</span>
                                    </div>
                                    {/* <div className='d-inline-flex gap-2 px-2'>
                                        <svg className="bi"><use xlinkHref="#heart-fill" /></svg>
                                        <svg className="bi"><use xlinkHref="#exclamation-triangle-fill" /></svg>
                                    </div>
                                     <div className=''>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                                        </div>
                                    </div> */}
                                    <div className='' data-bs-toggle="collapse" data-bs-target={'#' + plugin}>
                                        <svg className="bi"><use xlinkHref="#caret-right-fill" /></svg>
                                    </div>
                                </div>
                                <div className="collapse" id={plugin}>
                                    <div className='m-2 text-wrap'>
                                        {latest_version.description}
                                    </div>
                                    <div className='m-2 text-wrap'>
                                        {cats}
                                    </div>
                                    <div className="container">
                                        <div className="row d-flex justify-content-center row-cols-5">
                                            <PluginButton text="Download" onClick={() => { }} />
                                            <PluginButton text="Website" onClick={() => {
                                                imports.electron.openExternal(item.package_url)
                                            }} />
                                            {(item.donation_link ? (<PluginButton text="Donate" onClick={() => {
                                                imports.electron.openExternal(item.donation_link)
                                            }} />) : null)}

                                            <PluginButton><svg className="bi">
                                                <use xlinkHref={'#chevron-bar-down'} /></svg>&nbsp;
                                                {totalDownloads}
                                            </PluginButton>
                                            <PluginButton>
                                                <svg className="bi"><use xlinkHref={'#hand-thumbs-up'} /></svg>&nbsp;
                                                {item.rating_score}
                                            </PluginButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div className='row d-flex justify-content-center sticky-bottom '>

                        <PaginationButtons
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={itemsPerPage}
                            onCurrentPageChange={handleCurrentPageChange}
                        />
                    </div>
                </div >
            </>);

        }
    }

    function buildCatagories(mods_list) {
        const catagories = {}, c = [];
        mods_list.forEach(mod => { mod.categories.forEach(category => catagories[category] = 1) });
        for (let i in catagories) c.push(i);
        return c.sort();
    }

    function ListNav({ setSearchTerm, setCurrentPage, catagories, selectedCatagories, addCat, removeCat, filterOptions, setFilterOptions }) {
        // var [openDialog, set_openDialog] = useState('filters');
        var [openDialog, set_openDialog] = useState(null);

        // var [, update] = useState(null);

        function FiltersDialog(props) {

            var nsfwInput = useRef(null);
            var deprecatedInput = useRef(null);
            var mod_has_1_Input = useRef(null);
            var mad_has_all_Input = useRef(null);
            var mod_has_none_Input = useRef(null);

            useEffect(() => {
                nsfwInput.current.checked = filterOptions.nsfw;
                deprecatedInput.current.checked = filterOptions.deprecated;
                mod_has_1_Input.current.checked = filterOptions.mod_has_1;
                mad_has_all_Input.current.checked = filterOptions.mad_has_all;
                mod_has_none_Input.current.checked = filterOptions.mod_has_none;
            }, [])

            function onInputChange(e) {


                if (e.target == nsfwInput.current) {
                    filterOptions.nsfw = nsfwInput.current.checked;
                }
                if (e.target == deprecatedInput.current) {
                    filterOptions.deprecated = deprecatedInput.current.checked;
                }

                if (e.target == mod_has_1_Input.current) {
                    filterOptions.mod_has_1 = mod_has_1_Input.current.checked;
                    filterOptions.mad_has_all = !mod_has_1_Input.current.checked;
                    filterOptions.mod_has_none = !mod_has_1_Input.current.checked;
                }

                if (e.target == mad_has_all_Input.current) {
                    filterOptions.mod_has_1 = !mad_has_all_Input.current.checked;
                    filterOptions.mad_has_all = mad_has_all_Input.current.checked;
                    filterOptions.mod_has_none = !mad_has_all_Input.current.checked;
                }

                if (e.target == mod_has_none_Input.current) {
                    filterOptions.mod_has_1 = !mod_has_none_Input.current.checked;
                    filterOptions.mad_has_all = !mod_has_none_Input.current.checked;
                    filterOptions.mod_has_none = mod_has_none_Input.current.checked;
                }

                var fo = {};
                for (var i in filterOptions) {
                    fo[i] = filterOptions[i]
                }
                setFilterOptions(fo)
            }

            async function onSubmit() {
                set_openDialog(null)
            }

            return (<bootstrap.dialog
                title={'List Filters'}
                onClose={() => { set_openDialog(null) }}
                isOpen={openDialog == 'filters'}
            >
                <div className='container'>
                    <div className='row'>
                        <div className='d-flex flex-wrap gap-2'>
                            {selectedCatagories.map((cat, i) => {
                                var onClick = () => {
                                    removeCat(cat);
                                }
                                return (<button key={i} onClick={onClick} type="button" className="badge text-bg-primary">
                                    {cat}
                                </button >)
                            })}
                        </div>
                    </div>
                    <hr />
                    <div className='row'>
                        <div className='d-flex flex-wrap gap-2'>
                            {catagories.map((cat, i) => {
                                if (selectedCatagories.indexOf(cat) >= 0) return null;
                                var onClick = () => {
                                    addCat(cat);
                                }
                                return (<button key={i} onClick={onClick} type="button" className="badge text-bg-secondary">
                                    {cat}
                                </button >)
                            })}
                        </div>
                    </div>
                    <hr />
                    <div className='row'>
                        <div className='d-flex flex-wrap gap-2'>
                            <div className="form-check">
                                <input ref={mod_has_1_Input} className="form-check-input" type="radio" name="filterStyle" onChange={onInputChange} />
                                <label className="form-check-label">
                                    Mod has at least one of these categories
                                </label>
                            </div>
                            <div className="form-check">
                                <input ref={mad_has_all_Input} className="form-check-input" type="radio" value="2" name="filterStyle" onChange={onInputChange} />
                                <label className="form-check-label" >
                                    Mod has all of these categories
                                </label>
                            </div>
                            <div className="form-check">
                                <input ref={mod_has_none_Input} className="form-check-input" type="radio" value="3" name="filterStyle" onChange={onInputChange} />
                                <label className="form-check-label">
                                    Mod has none of these categories
                                </label>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className='row'>
                        <div className='d-flex flex-wrap gap-2'>

                            <div className="form-check form-checkbox">
                                <input ref={nsfwInput} className="form-check-input" type="checkbox" onChange={onInputChange} />
                                <label className="form-check-label">Allow NSFW (potentially explicit) mods</label>
                            </div>
                            <div className="form-check form-checkbox">
                                <input ref={deprecatedInput} className="form-check-input" type="checkbox" onChange={onInputChange} />
                                <label className="form-check-label">Show deprecated mods</label>
                            </div>

                        </div>
                    </div>
                    <hr />
                    <div className='row'>

                        <button className="btn btn-danger" onClick={() => {
                            onSubmit();
                        }}>OK</button>
                    </div>
                </div>
            </bootstrap.dialog >);
        }

        return (<>
            <div className="sticky-top navbar bg-default px-0 shadow">
                <ul className="navbar-nav flex-md-row w-100 px-1">
                    <li className="nav-item col-md-5 col-sm-12 ps-md-1">
                        <label htmlFor="exampleSelect1">Search</label>
                        <div id="navbarSearch" className="w-100">
                            <input onChange={(event) => {
                                setSearchTerm(event.target.value);
                                setCurrentPage(1);
                            }} style={{ outline: '1px' }} className="form-control" type="text" placeholder="Search for mod" aria-label="Search" />
                        </div>
                    </li>
                    <li className="col-6 col-sm-12 col-md-7">
                        <ul className="navbar-nav flex-row w-100 px-1">
                            <li className="nav-item col-4 px-md-1">
                                <label htmlFor="exampleSelect1">Sort</label>
                                <select className="form-control form-select" id="exampleSelect1">
                                    <option value="0">Custom</option>
                                    <option value="1">Mod Name</option>
                                    <option value="2">Author</option>
                                </select>
                            </li>
                            <li className="nav-item col-4 pe-md-1 ">
                                <label htmlFor="exampleSelect1"></label>
                                <select className=" form-control form-select" id="exampleSelect2">
                                    <option value="0">Standard</option>
                                    <option value="1">Reversed</option>
                                </select>
                            </li>
                            <li className="nav-item col-4 pe-md-1 ">
                                <label htmlFor="exampleSelect1">Additional</label>
                                <button className=" form-control form-button" onClick={() => set_openDialog('filters')}>Filters</button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <FiltersDialog />
        </>)
    }



    function PaginationButtons({ totalPages, pageSize, onCurrentPageChange, currentPage }) {
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
        return (
            <div className="btn-group">
                <button
                    type="button"
                    onClick={() => onCurrentPageChange(1)}
                    className={`page-item btn btn-primary` + (currentPage == 1 ? ' disabled' : '')}
                >&lt;&lt;</button>
                <button
                    type="button"
                    onClick={() => onCurrentPageChange(currentPage - 1)}
                    className={`page-item btn btn-primary` + (currentPage == 1 ? ' disabled' : '')}
                >&lt;</button>
                {pageNumbers.map((pageNumber, i) => {
                    var show = false;
                    switch (pageNumber) {
                        case currentPage - 1:
                        case currentPage - 2:
                        case currentPage + 1:
                        case currentPage + 2:
                        case currentPage:
                            show = true;
                            break;
                        default:
                            break;
                    }
                    if (!show) return null;
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onCurrentPageChange(pageNumber)}
                            className={`page-item btn ` + (pageNumber == currentPage ? ' btn-danger disabled' : ' btn-primary')}
                        >{pageNumber}</button>
                    );
                })}
                <button
                    type="button"
                    onClick={() => onCurrentPageChange(currentPage + 1)}
                    className={`page-item btn btn-primary` + (currentPage == totalPages ? ' disabled' : '')}
                >&gt;</button>
                <button
                    type="button"
                    onClick={() => onCurrentPageChange(totalPages)}
                    className={`page-item btn btn-primary` + (currentPage == totalPages ? ' disabled' : '')}
                >&gt;&gt;</button>
            </div>
        );
    }
}


function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}