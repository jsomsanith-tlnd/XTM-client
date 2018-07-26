#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const program = require('commander');
const FormData = require('form-data');

// TODO add your credentials
const CLIENT = 'Talend';
const USER_ID = 0;
const PASSWORD = '';

// TODO add your project name
const PROJECT_NAME = 'UI';

const API_URL = 'https://wstest2.xtm-intl.com/rest-api';
const API_URL_LOGIN = 'https://www.xtm-cloud.com/rest-api/auth/token';

const data = {};

function parseArguments() {
	program
		.version('0.1.0')
		.option('-f, --file [value]', 'File to upload')
		.parse(process.argv);

	if (!fs.existsSync(program.file)) {
		console.error(`You need to provide a path to existing file. File path: ${program.file}`);
	}
	data.filePath = program.file;
}

function handleError(res) {
	if (res.status < 200 || res.status >= 300) {
		return res.json().then(payload => {
			throw new Error(payload.reason);
		});
	}
	return res;
}

function login() {
	console.log();
	console.log(`Login with user ${USER_ID}...`);

	const body = { client: CLIENT, userId: USER_ID, password: PASSWORD };
	return fetch(API_URL_LOGIN, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
	})
		.then(handleError)
		.then(res => res.json())
		.then(res => (data.token = res.token))
		.then(() => console.log('Logged in successfully.'));
}

function getUIProject() {
	console.log();
	console.log('Fetch project UI...');

	function filterProjectList(projects) {
		const uiProject = projects.find(({ name }) => name === PROJECT_NAME);
		if (!uiProject) {
			throw new Error('UI project not found');
		}
		return uiProject;
	}

	return fetch(`${API_URL}/projects`, {
		headers: { Authorization: `XTM-Basic ${data.token}` },
	})
		.then(handleError)
		.then(res => res.json())
		.then(filterProjectList)
		.then(project => (data.project = project))
		.then(() => console.log(`Project found: ${JSON.stringify(data.project, null, 2)}`));
}

function uploadFiles() {
	console.log();
	console.log(`Upload file ${data.filePath} to XTM project...`);

	const form = new FormData();
	form.append('matchType', 'MATCH_NAMES');
	form.append('files', fs.createReadStream(data.filePath), {
		name: path.basename(data.filePath),
	});

	return fetch(`${API_URL}/projects/${data.project.id}/files/upload`, {
		method: 'POST',
		headers: { Authorization: `XTM-Basic ${data.token}`, 'Content-Type': 'multipart/form-data' },
		body: form,
	})
		.then(handleError)
		.then(res => res.json())
		.then(res => console.log(res))
		.then(() => console.log(`Project has been updated with ${data.filePath}`));
}

parseArguments();
login()
	.then(getUIProject)
	.then(uploadFiles)
	.catch(error => {
		console.error(error);
		throw error;
	});
