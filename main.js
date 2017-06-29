'use strict';

const {app, BrowserWindow, Tray, globalShortcut} = require('electron');

const platform = process.platform;
let tray = null;
let browser = null;

// Unshow the icon in dock application on macOS.
if(platform == 'darwin'){
	app.dock.hide();
}

app.on("ready", event => {
	globalShortcut.register("CommandOrControl+Shift+Space", function(){

	});
	createTray();
});

app.on("will-quit", event => {
	globalShortcut.unregister("CommandOrControl+Shift+Space");
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
		height:      600
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
}

function toggleBrowser(bounds) {
	if (!browser) createBrowser();
	if (browser.isVisible()) hideBrowser();
	else showBrowser(bounds || tray.getBounds());
}
