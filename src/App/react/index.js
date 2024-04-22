import { createRoot } from 'react-dom/client';

setup.consumes = [];
setup.provides = ['react'];

export default function setup(imports, register) {

    var react = {};

    react.root = createRoot(document.getElementById('root'));

    react.onload = function (ele) {
        window.addEventListener('DOMContentLoaded', async () => {
            react.root.render(ele);
        });
    }

    register(null, { react });
}
