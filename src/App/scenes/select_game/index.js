
import React, { useEffect, useState } from 'react';

setup.consumes = ['scenes', 'config', 'bootstrap', 'thunderstore', 'games'];
setup.provides = [];

export default function setup(imports, register) {

    register(null);
    const scenes = imports.scenes;
    const games = imports.games;
    const bootstrap = imports.bootstrap;
    const thunderstore = imports.thunderstore;

    scenes.add('select_game', function select_game() {

        var [games_list, setGamesList] = useState(null);

        useEffect(() => {
            (async () => {
                setGamesList(await thunderstore.community());
            })();
        }, [])

        if (games_list)
            return (<>
                <bootstrap.navbar title="Select Game" back_title="Change Data Directory" back_action={() => {
                    scenes.load('change_data_dir')
                }} />
                <div className="container pt-4">
                    <div className='row'>
                        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 p-4 pt-0">
                            {games_list.map((item, index) => {
                                //if
                                var game = games.find(item.identifier);
                                if (game) {
                                    item.game = game;
                                    return (<GameCard key={index} item={item} game={game} select={() => {
                                        scenes.load('select_profile', item);
                                    }} />)
                                }
                                return null;
                            })}
                        </div>
                    </div>
                </div>
            </>);
        else
            return (<></>);

    })

    function GameCard(props) {
        var item = props.item;
        var game = props.game;
        return (<>
            <div className="card">
                <div className="card-header text-center">{item.name}</div>
                <div className="card-body text-center">
                    <img className="w-100" src={game.image} />
                </div>
                <button onClick={() => { props?.select(); }} className="btn btn-primary col-12 ">Select Game</button>
            </div>
        </>)
    }

}

