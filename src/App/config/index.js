/**

var config = app.config('test',{
    testing : 'ok-default'
})

console.log(config.testing);

 */

setup.consumes = [];
setup.provides = ['config'];

export default function setup(imports, register) {

    const getStored = (name) => {
        var r = JSON.parse(localStorage.getItem(name));
        if(r) return r;
        setStored(name,{});        
        return getStored(name);
    };
    const setStored = (name, configObj) => 
        localStorage.setItem(name, JSON.stringify(configObj));

    function Config(config_name, config_defaults) {
        var $config_mem = getStored(config_name);
        var $config_obj = {};

        for (var i in config_defaults) {
            ((config_property, default_value)=>{                    
                Object.defineProperty($config_obj, config_property, {
                    get() {
                        return $config_mem[config_property];
                    },
                    set(newValue) {
                        $config_mem[config_property] = newValue;
                        setStored(config_name, $config_mem)
                    },
                    enumerable: true,
                    configurable: true,
                });
                if(typeof $config_obj[config_property] == 'undefined'){
                    $config_obj[config_property] = default_value;
                    setStored(config_name, $config_mem);
                }
            })(i, config_defaults[i]);
        }

        return $config_obj;
    }

    register(null, {
        config: Config
    });
}
