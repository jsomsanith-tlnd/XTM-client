#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const program = require('commander');
const FormData = require('form-data');
const { API_URL, handleError, login, getUIProject } = require('./xtm');

function parseArguments() {
	program
		.version('0.1.0')
		.option('-f, --file [value]', 'File to upload')
		.parse(process.argv);

	if (!fs.existsSync(program.file)) {
		console.error(`You need to provide a path to existing file. File path: ${program.file}`);
		process.exit(1);
	}
}

function uploadFiles(data) {
	const filePath = program.file;
	console.log();
	console.log(`Upload file ${filePath} to XTM project...`);

	const form = new FormData();
	form.append('matchType', 'MATCH_NAMES');
	form.append('files[0].file', fs.createReadStream(filePath));

	return fetch(`${API_URL}/projects/${data.project.id}/files/upload`, {
		method: 'POST',
		headers: { Authorization: `XTM-Basic ${data.token}` },
		body: form,
	})
		.then(handleError)
		.then(res => res.json())
		.then(res => console.table(res.jobs))
		.then(() => console.log(`Project has been updated with ${filePath}`));
}

parseArguments();
login()
	.then(getUIProject)
	.then(uploadFiles)
	.catch(error => {
		console.error(error);
		throw error;
	});
