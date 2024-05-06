var games = [
    require('./lethal-company')
];

setup.consumes = [];
setup.provides = ['games'];

export default function setup(imports, register) {
    
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

