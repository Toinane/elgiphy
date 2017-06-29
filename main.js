'use strict';

const electron = require('electron');
const {app, BrowserWindow, Tray} = require('electron');

const platform = process.platform;
let tray = null;
let browser = null;

// Unshow the icon in dock application on macOS.
if(platform == 'darwin'){
	app.dock.hide();
}

app.on("ready", event => {
	electron.globalShortcut.register("CommandOrControl+Shift+Space");
	createTray();
});

app.on("will-quit", event => {
	electron.globalShortcut.unregister("CommandOrControl+Shift+Space");
});


function createTray() {
	if (tray) return;

	tray = new Tray(`ressources/tray@3x.png`);

	tray.on("click", (event, bounds) => {
		toggleBrowser(bounds);
	});
}

function createBrowser() {
	if (browser) return;
	const options = {
		show:        false,
		frame:       false,
		resizable:   false,
		width:       350,
		height:      500
	}
	browser = new BrowserWindow(options);
	browser.on("blur", hideBrowser);

	//browser.openDevTools();
	browser.loadURL(`file://${__dirname}/src/index.html`);
}

function showBrowser(bounds) {
	tray.setImage(`ressources/tray-white@3x.png`);
	browser.setPosition(parseInt(bounds.x - (350 / 2) + (bounds.width / 2)), bounds.y  + 14);
	browser.show();
	tray.setHighlightMode("always");
}

function hideBrowser() {
	tray.setImage(`ressources/tray@3x.png`);
	browser.hide();
	tray.setHighlightMode("never");
	electron.Menu.sendActionToFirstResponder("hide:");
}

function toggleBrowser(bounds) {
	if (!browser) createBrowser();
	if (browser.isVisible()) hideBrowser();
	else showBrowser(bounds || tray.getBounds());
}
