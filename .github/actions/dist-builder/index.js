const { exec } = require('child_process');
const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

/**
 * Logs to the console
 */
const log = (...msg) => console.log(...msg); // eslint-disable-line no-console

/**
 * Exits the current process with an error code and message
 */
const exit = (...msg) => {
    console.error('index.js', ...msg);
    process.exit(1);
};

/**
 * Returns the value for an environment variable (or `null` if it's not defined)
 */
const getEnv = (name) => process.env[name.toUpperCase()] || null;

/**
 * Sets the specified env variable if the value isn't empty
 */
const setEnv = (name, value) => {
    if (value) {
        process.env[name.toUpperCase()] = value.toString();
    }
};

/**
 * Returns the value for an input variable (or `null` if it's not defined). If the variable is
 * required and doesn't have a value, abort the action
 */
const getInput = (name, required) => {
    const value = getEnv(`INPUT_${name}`);
    if (required && !value) {
        exit(`"${name}" input variable is not defined`);
    }
    return value;
};


function executeSequentially(jobList) {
    var result = Promise.resolve();
    jobList.forEach(function (job) {
        result = result.then(() => {
            return new Promise((resolve, rejects) => {
                job((err) => {
                    if (err) return rejects(err);
                    resolve()
                });
            });
        });
    });
    return result;
}

function runAsync(cmd, cwd, callback, dont_logOutput) {
    log('running', cmd, cwd);
    return new Promise((res) => {
        // let output = '';
        const prog = exec(cmd, { encoding: 'utf8', cwd }, (error) => {
            callback(error);
            res();
        });
        prog.stdout.on('data', (data) => {
            if (!dont_logOutput)
                log(`${data.trim()}`);
            // output += data.toString('utf8');
        });
        prog.stderr.on('data', (data) => {
            if (!dont_logOutput)
                log(`${data.trim()}`);
            // output += data.toString('utf8');
        });
    });
}

/**
 * Installs NPM dependencies and builds/releases the Electron app
 */
const runAction = () => {

    const github_token = getInput('github_token');
    if (github_token)
        setEnv('GITHUB_TOKEN', github_token);

    const pkgRoot = getInput('package_root') || '.';
    const appRoot = getInput('app_root') || pkgRoot;
    const pkgJsonPath = join(pkgRoot, 'package.json');
    if (!existsSync(pkgJsonPath)) {
        exit(`\`package.json\` file not found at path "${pkgJsonPath}"`);
    }
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
    log(`Building ${pkgJson.name}@${pkgJson.version} `);

    var jobs = [];

    var node_modules_installed = false;

    jobs.push((next) => {
        runAsync('npm list', appRoot, (err) => {
            if (err) {
                node_modules_installed = false;
            } else {
                node_modules_installed = true;
            }
            next()
        }, true)
    })

    jobs.push((next) => {
        if (!node_modules_installed) {
            runAsync('npm install', appRoot, (err) => {
                if (err) {
                    exit(`\`npm install\` failed to run.`);
                } else {
                    next()
                }
            })
        } else next()
    })

    jobs.push((next) => {
        runAsync('npm run lint', appRoot, (err) => {
            if (err) {
                exit(`\`npm run lint\` failed to run.`);
            } else {
                next()
            }
        })
    })

    jobs.push((next) => {
        if (github_token) {
            runAsync('npm run publish', appRoot, (err) => {
                if (err)
                    exit(`\`npm run publish\` failed to run.`);
                else
                    next()
            })
        } else {
            runAsync('npm run package', appRoot, (err) => {
                if (err)
                    exit(`\`npm run package\` failed to run.`);
                else
                    next()
            })
        }
    })

    jobs.push((next) => {
        log('DONE')
        next();
    })

    executeSequentially(jobs)
};
runAction();
