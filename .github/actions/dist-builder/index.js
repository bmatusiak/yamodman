const { execSync } = require("child_process");
const { existsSync, readFileSync } = require("fs");
const { join } = require("path");

/**
 * Logs to the console
 */
const log = (msg) => console.log(`\n${msg}`); // eslint-disable-line no-console

/**
 * Exits the current process with an error code and message
 */
const exit = (msg) => {
	console.error("index.js",msg);
	process.exit(1);
};

/**
 * Executes the provided shell command and redirects stdout/stderr to the console
 */
const run = (cmd, cwd) => {
	log(`${cwd}$ ${cmd}`);
	execSync(cmd, { encoding: "utf8", stdio: "inherit", cwd });
};

/**
 * Determines the current operating system (one of ["mac", "windows", "linux"])
 */
const getPlatform = () => {
	switch (process.platform) {
		case "darwin":
			return "mac";
		case "win32":
			return "windows";
		default:
			return "linux";
	}
};

/**
 * Returns the value for an environment variable (or `null` if it's not defined)
 */
const getEnv = (name) => process.env[name.toUpperCase()] || null;

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

/**
 * Sets the specified env variable if the value isn't empty
 */
const setEnv = (name, value) => {
	if (value) {
		process.env[name.toUpperCase()] = value.toString();
	}
};

/**
 * Installs NPM dependencies and builds/releases the Electron app
 */
const runAction = () => {
    const pkgRoot = getInput("package_root") || ".";
    const appRoot = getInput("app_root") || pkgRoot;
    
	const pkgJsonPath = join(pkgRoot, "package.json");

	if (!existsSync(pkgJsonPath)) {
		exit(`\`package.json\` file not found at path "${pkgJsonPath}"`);
	}

    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));

	log(`Building ${pkgJson.version} `);

	run(`npm install`, appRoot);
	run(`npm run publish`, appRoot);
	
};

runAction();