const { execSync, exec } = require("child_process");
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
	console.error("index.js", msg);
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

function runAsync(cmd, cwd, callback) {
	console.log("running", cmd, cwd);
	return new Promise((res) => {
		const prog = exec(cmd, { encoding: "utf8", stdio: "inherit", cwd }, (error, stdout, stderr) => {
			// if (error) {
			// 	console.error(`exec error: ${error}`);
			// 	return;
			// }
			// console.log(`stdout: ${stdout}`);
			// console.log(`stderr: ${stderr}`);
			callback();
			res();
		});
		prog.stdout.on('data', (data) => {
			console.log(`${data}`);
		});
		prog.stderr.on('data', (data) => {
			console.log(`${data}`);
		});
	})
	// return new Promise(() => {
	// 	let output;
	// 	let output_err;
	// 	const prog = spawn(cmd, cmd_args);
	// 	prog.stdout.on('data', (data) => {
	// 		console.log(`stdout: ${data}`);
	// 		if (!output) output = "";
	// 		output += data.toString("utf8");
	// 	});
	// 	prog.stderr.on('data', (data) => {
	// 		console.error(`stderr: ${data}`);
	// 		if (!output_err) output_err = "";
	// 		output_err += data.toString("utf8");
	// 	});
	// 	prog.on('close', (code) => {
	// 		console.log(`child process exited with code ${code}`);
	// 		callback(output, output_err);
	// 	});
	// })

}

/**
 * Installs NPM dependencies and builds/releases the Electron app
 */
const runAction = () => {

	const github_token = getInput("github_token", true);
	setEnv("GITHUB_TOKEN", github_token);

	const pkgRoot = getInput("package_root") || ".";
	const appRoot = getInput("app_root") || pkgRoot;
	const pkgJsonPath = join(pkgRoot, "package.json");
	if (!existsSync(pkgJsonPath)) {
		exit(`\`package.json\` file not found at path "${pkgJsonPath}"`);
	}
	const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
	log(`Building ${pkgJson.version} `);


	// run('npm install', appRoot);
	// run('npm run publish', appRoot);
	var jobs = [];

	jobs.push((next) => {
		runAsync('npm install', appRoot, (err, output) => {
			next()
		})
	})


	jobs.push((next) => {
		runAsync('npm run publish', appRoot, (err, output) => {
			next()
		})
	})

	executeSequentially(jobs)
};
runAction();
