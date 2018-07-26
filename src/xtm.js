#!/usr/bin/env node

const fetch = require('node-fetch');

// TODO configure your XTM info
const CLIENT = '';
const USER_ID = 0;
const PASSWORD = '';
const PROJECT_NAME = '';
const API_URL = '';

const data = {};

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
	return fetch(`${API_URL}/auth/token`, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
	})
		.then(handleError)
		.then(res => res.json())
		.then(res => (data.token = res.token))
		.then(() => console.log('Logged in successfully.'))
		.then(() => data);
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
		.then(() => console.log(`Project found: ${JSON.stringify(data.project, null, 2)}`))
		.then(() => data);
}

module.exports = {
	CLIENT,
	USER_ID,
	PASSWORD,
	PROJECT_NAME,
	API_URL,

	handleError,
	login,
	getUIProject,
};
