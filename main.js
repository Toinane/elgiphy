'use strict';

const {app, BrowserWindow, Tray, globalShortcut, ipcMain} = require('electron');

const platform = process.platform;
let tray = null;
let browser = null;


app.on("ready", event => createTray());


ipcMain.once('viewActive', () => {
	// Unshow the icon in dock application on macOS.
	// if(platform == 'darwin'){
	// 	app.dock.hide();
	// }
});

function createTray() {
	if (tray) return;

	tray = new Tray(`${__dirname}/ressources/tray@3x.png`);
	tray.on("click", (event, bounds) => {
		toggleBrowser(bounds);
	});
}

function createBrowser() {
	const options = {
		width: 350,
		height: 600,
		show: false,
		frame: false,
		resizable: false,
		vibrancy: 'selection'
	}

	browser = new BrowserWindow(options);
	browser.on("blur", hideBrowser);

	//browser.openDevTools();
	browser.loadURL(`file://${__dirname}/src/index.html`);
}

function showBrowser(bounds) {
	tray.setImage(`${__dirname}/ressources/tray-white@3x.png`);
	//browser.setPosition(parseInt(bounds.x - (350 / 2) + (bounds.width / 2)), bounds.y  + 14);
	browser.show();
	tray.setHighlightMode("always");
}

function hideBrowser() {
	tray.setImage(`${__dirname}/ressources/tray@3x.png`);
	browser.hide();
	tray.setHighlightMode("never");
}

function toggleBrowser(bounds) {
	if (!browser) createBrowser();
	if (browser.isVisible()) hideBrowser();
	else showBrowser(bounds || tray.getBounds());
}
