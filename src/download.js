#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const program = require('commander');
const shell = require('shelljs');
const { API_URL, handleError, login, getUIProject } = require('./xtm');

function parseArguments() {
	program
		.version('0.1.0')
		.option('-p, --path [value]', 'Folder path where to download')
		.parse(process.argv);

	if (!program.path) {
		console.error(`You need to provide a path to existing file.`);
		process.exit(1);
	}
}

function downloadFiles(data) {
	console.log();
	console.log(`Download file from XTM project...`);

	return fetch(`${API_URL}/projects/${data.project.id}/files/download?fileType=TARGET`, {
		headers: { Authorization: `XTM-Basic ${data.token}` },
	})
		.then(handleError)
		.then(res => {
			shell.mkdir('-p', program.path);
			const fileStream = fs.createWriteStream(`${program.path}/i18n.zip`);
			return new Promise((resolve, reject) => {
				res.body.pipe(fileStream);
				res.body.on('error', err => {
					reject(err);
				});
				fileStream.on('finish', function() {
					resolve();
				});
			});
		})
		.then(() => console.log('Translations downloaded as i18n.zip'));
}

parseArguments();
login()
	.then(getUIProject)
	.then(downloadFiles)
	.catch(error => {
		console.error(error);
		throw error;
	});
