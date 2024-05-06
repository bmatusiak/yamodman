import { createRoot } from 'react-dom/client';

setup.consumes = [];
setup.provides = ['react'];

export default function setup(imports, register) {    
    if (typeof document == 'undefined') return register(null, { react: void 0 });
    var react = {};
    react.root = createRoot(document.getElementById('root'));
    register(null, { react });
}
