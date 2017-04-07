const Electron = require("electron");

let tray = null;
let browser = null;

Electron.app.dock.hide();

function createTray() {
	if (tray) return;
	tray = new Electron.Tray('tray.png');
	tray.on("click", (event, bounds) => {
		if (!browser) createBrowser();
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
	browser = new Electron.BrowserWindow(options);
	browser.on("blur", hideBrowser);
	browser.webContents.on("new-window", (event, url) => {
		event.preventDefault();
		Electron.shell.openExternal(url);
	});
	browser.openDevTools();
	browser.loadURL(`file://${__dirname}/index.html`);
}

function showBrowser(bounds) {
	browser.setPosition(parseInt(bounds.x - (350 / 2) + (bounds.width / 2)), bounds.y  + 14);
	browser.show();
	tray.setHighlightMode("always");
}

function hideBrowser() {
	browser.hide();
	tray.setHighlightMode("never");
	Electron.Menu.sendActionToFirstResponder("hide:");
}

function toggleBrowser(bounds) {
	if (!browser) createBrowser();
	if (browser.isVisible()) hideBrowser();
	else showBrowser(bounds || tray.getBounds());
}

Electron.ipcMain.on("hide-browser", (event, data) => {
	if (data) hideBrowser();
});

Electron.app.on("ready", event => {
	Electron.Menu.setApplicationMenu(Electron.Menu.buildFromTemplate([
		{
			label: "Edit",
			submenu: [
				{role: "undo"},
				{role: "redo"},
				{type: "separator"},
				{role: "copy"},
				{role: "cut"},
				{role: "paste"},
				{role: "pasteandmatchstyle"},
				{role: "delete"},
				{role: "selectall"},
			]
		}
	]));

	createTray();
	Electron.globalShortcut.register("CommandOrControl+Shift+Space", () => {
		toggleBrowser();
	});
});

Electron.app.on("will-quit", event => {
	Electron.globalShortcut.unregister("CommandOrControl+Shift+Space");
});
