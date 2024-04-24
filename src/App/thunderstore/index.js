import * as api_request from './request';

setup.consumes = [];
setup.provides = ['thunderstore'];

export default function setup(imports, register) {

    register(null, {
        thunderstore: api_request
    });
}
