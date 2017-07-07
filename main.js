'use strict';

const {app, BrowserWindow} = require('electron');

app.on("ready", event => createBrowser());

app.on("will-quit", event => console.log('bye-bye all!'));

function createBrowser() {
	const options = {
		width: 350,
		height: 600
	}

	let browser = new BrowserWindow(options);
	browser.openDevTools();
	browser.loadURL(`file://${__dirname}/src/index.html`);
}
