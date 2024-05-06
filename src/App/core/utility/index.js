setup.consumes = [];
setup.provides = ['utility'];

import YAML from 'yaml';

import React, { useEffect, useState, useRef } from 'react';

const fs = require('fs', !0);
const https = require('https', !0);
const path = require('path', !0);

export default function setup(imports, register) {
    const utility = { fs, https, path };

    utility.image = function (props) {
        const imgRef = useRef(null);
        var { src } = props;
        var element_props = {};
        for (var i in props) {
            if (i == 'src') continue;
            element_props[i] = props[i];
        }
        useEffect(() => {
            (async () => {
                var base64Img = await utility.getRemoteImageBase64(src);
                if (imgRef.current)
                    imgRef.current.src = base64Img;
            })();
        }, [])

        return (<img {...element_props} ref={imgRef} ></img>)
    }

    utility.getRemoteImageBase64 = function (url) {
        return new Promise((resolve, reject) => {
            https.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to fetch image: ${response.statusCode}`));
                    return;
                }
                const chunks = [];
                response.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                response.on('end', () => {
                    const binaryData = Buffer.concat(chunks);
                    const b64Data = binaryData.toString('base64');
                    const contentType = response.headers['content-type'];
                    resolve(`data:${contentType};base64,${b64Data}`);
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    utility.request_json = function (url, callback) {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let body = '';
                res.on('data', (chunk) => {
                    body += chunk;
                });
                res.on('end', () => {
                    try {
                        let json = JSON.parse(body);
                        if (!(typeof callback == 'undefined'))
                            callback(null, json)
                        resolve(json)
                    } catch (error) {
                        if (!(typeof callback == 'undefined'))
                            callback(error.message)
                        reject(error.message);
                    }
                });
            }).on('error', (error) => {
                console.error(error.message);
            });
        });

    }
    utility.getDirectories = async (source) => new Promise((resolve, reject) => {
        const { readdir } = fs;
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
    utility.fs_remove = (folderPath) => new Promise((resolve, reject) => {
        const { rm } = fs;
        rm(folderPath, { recursive: true, dryRun: true }, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        });
    });

    utility.readFile = async (filePath) => {

        try {
            // Check if file exists
            await fs.promises.access(filePath, fs.constants.F_OK);

            // Read file content
            const data = await fs.promises.readFile(filePath, 'utf8');
            return data;
        } catch (err) {
            console.error('Error reading file:', err);
            // Optionally throw the error if unrecoverable
            // throw err;
        }
    }

    utility.writeFile = async (filePath, data) => {
        // Extract directory path from the full path
        const directoryPath = path.dirname(filePath);

        // Check if directory exists
        try {
            await fs.promises.access(directoryPath, fs.constants.F_OK);
        } catch (err) {
            // If directory doesn't exist, create it recursively (with intermediate directories)
            await fs.promises.mkdir(directoryPath, { recursive: true });
        }

        // Write data to the file
        try {
            await fs.promises.writeFile(filePath, data, 'utf8');
            console.log(`File written successfully to: ${filePath}`);
        } catch (err) {
            console.error('Error writing file:', err);
        }

    };


    utility.yaml = {};
    utility.yaml.read = async (fileName) => new Promise((resolve, reject) => {
        const { readFileSync } = fs;
        try {
            const file = readFileSync(fileName, 'utf8');
            resolve(YAML.parse(file));
        } catch (e) {
            reject(e)
        }
    });
    utility.yaml.write = async (fileName, data) => new Promise((resolve, reject) => {
        const { writeFileSync } = fs;
        try {
            writeFileSync(fileName, YAML.stringify(data), 'utf8');
            resolve();
        } catch (e) {
            reject(e)
        }
    });

    register(null, { utility });

}
