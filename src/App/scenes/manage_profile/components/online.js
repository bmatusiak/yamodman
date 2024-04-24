import React from 'react';

export default function (profile, item) {
    return {
        id: 'online',
        catagory: 'mods',
        title: 'Online',
        icon: 'globe',
        component: function component(props) {

            return (<>
                <div className="sticky-top navbar bg-default px-0 shadow">
                    <ul className="navbar-nav flex-md-row w-100 px-1">
                        <li className="nav-item col-md-5 col-sm-12 ps-md-1">
                            <label htmlFor="exampleSelect1">Search</label>
                            <div id="navbarSearch" className="w-100">
                                <input style={{ outline: '1px' }} className="form-control" type="text" placeholder="Search for mod" aria-label="Search" />
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
                                    <label htmlFor="exampleSelect1">Disabled</label>
                                    <select className="form-control form-select" id="exampleSelect3">
                                        <option value="0">None</option>
                                        <option value="1">Custom</option>
                                        <option value="0">First</option>
                                        <option value="1">Last</option>
                                    </select>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className='container py-4'>
                    <h3>ok1</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                    <h3>ok</h3><br />
                </div>
            </>);

        }
    }
}
