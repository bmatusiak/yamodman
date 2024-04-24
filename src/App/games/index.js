var games = [
    require('./lethal-company')
];

setup.consumes = [];
setup.provides = ['games'];

export default function setup(imports, register) {
    //console.log('bootstrap');
    register(null, {
        games: {
            find: (gameID) => {
                for (var i in games) {
                    if (games[i].default == gameID) {
                        return games[i]
                    }
                }

            }
        }
    });
}

