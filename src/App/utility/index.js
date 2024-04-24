/**

var typeStore = app.typeStore('test',{
    testing : 'ok-default'
})

console.log(typeStore.testing);

 */

setup.consumes = [];
setup.provides = ['utility'];

import YAML from 'yaml';

const { readdir, readFileSync, writeFileSync } = require('fs', !0)

export default function setup(imports, register) {
    const utility = {};

    utility.getDirectories = async (source) => new Promise((resolve, reject) => {
        readdir(source, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err)
            } else {
                resolve(
                    files
                        .filter(dirent => dirent.isDirectory())
                        .map(dirent => dirent.name)
                )
            }
        })
    });

    utility.yaml = {};
    utility.yaml.read = async (fileName) => new Promise((resolve, reject) => {
        try {
            const file = readFileSync(fileName, 'utf8');
            resolve(YAML.parse(file));
        } catch (e) {
            reject(e)
        }
    });
    utility.yaml.write = async (fileName, data) => new Promise((resolve, reject) => {
        try {
            writeFileSync(fileName, YAML.stringify(data), 'utf8');
            resolve();
        } catch (e) {
            reject(e)
        }
    });

    register(null, { utility });

}
