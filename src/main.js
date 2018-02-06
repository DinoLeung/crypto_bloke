const {app, BrowserWindow, net} = require("electron");
const path = require("path");
const url = require("url");
const io = require("socket.io-client");
const coincap = "https://coincap.io/";

// adds debug features like hotkeys for triggering dev tools and reload
require("electron-debug")();

// prevent window being garbage collected
let mainWindow;

var coinList, coinData;

app.on("ready", () => {
	mainWindow = createMainWindow();
	
	//Get initial data from CoinCap
	coincapGet("map").then((body) => {
		//get list of coin name, symbol
		coinList = body;
		return coincapGet("front");
	}).then((body) => {
		//get list of coin price data
		coinData = body;
	}).then(() => {
		//subscript to wesocket, get coinData update
		subscribeCoincapSocket();
	});
	
});

app.on("activate", () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on("window-all-closed", () => {
	// if (process.platform !== "darwin")
	app.quit();
});

function createMainWindow() {
	const win = new BrowserWindow({
		width: 600,
		height: 400
	});

	win.loadURL(url.format({
		pathname: path.join(__dirname, "../html/index.html"),
		protocol: "file:",
		slashes: true
	}));
	win.on("closed", onClosed);
	return win;
}

function coincapGet(key){
	return new Promise(function(resolve, reject) {
		var request = net.request(coincap + key);
		request.on("response", (response) => {
			if (response.statusCode < 200 || response.statusCode >= 300)
				return reject(new Error("statusCode=" + response.statusCode));
			var body = [];
			response.on("data", (chunk) => body.push(chunk));
			response.on("end", () => {
				try {
					body = JSON.parse(Buffer.concat(body).toString());
				} catch(e) {
					reject(e);
				}
				resolve(body);
			});
		});
		request.on("error", (error) => {
			reject(error);
		});
		request.end();
	});
}

function subscribeCoincapSocket() {
	//Socket.io
	var socket = io(coincap);
	socket.on("trades", function(message) {
		//update coinData
		var index = coinData.findIndex(obj => obj.short === message.coin);
		// var raise = message.msg.price > coinData[index].price;
		coinData[index] = message.msg;
	});
}

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}




