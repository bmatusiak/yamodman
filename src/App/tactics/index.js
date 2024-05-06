var tactics = [
    require('./installers'),
    require('./profiles'),
    require('./runners'),
];

setup.consumes = [];
setup.provides = ['tactics'];

export default function setup(imports, register) {
    
    register(null, {
        tactics: {
            find: (tactic) => {
                for (var i in tactics) {
                    if (tactics[i].default == tactic) {
                        return tactics[i]
                    }
                }
            }
        }
    });
}

