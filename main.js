'use strict';

const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron');

app.on("ready", event => {
	globalShortcut.register("CommandOrControl+Shift+Space", function(){});
	createBrowser();
});

app.on("will-quit", event => {
	globalShortcut.unregister("CommandOrControl+Shift+Space");
});

ipcMain.on('viewActive', (event, message) => {
	console.log(message);
});


ipcMain.on('viewActive', (event, message) => {
	console.log(message);
});

app.on("will-quit", event => console.log('bye-bye all!'));

function createBrowser() {
	const options = {
		width: 350,
		height: 600,
		frame: false,
		resizable: false,
		vibrancy: 'selection'
	}

	let browser = new BrowserWindow(options);
	//browser.openDevTools();
	browser.loadURL(`file://${__dirname}/src/index.html`);
}
