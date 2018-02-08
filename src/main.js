const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
var CoinCap = require('./coinCap')

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// prevent window being garbage collected
let mainWindow

// var coinList, coinData;

app.on('ready', () => {
  mainWindow = createMainWindow()

  // Get initial data from CoinCap
  CoinCap.fetchCoinName()
    .then(() => { return CoinCap.fetchExchangeRate() })
    .then(() => { return CoinCap.fetchCoinData() })
    .then(() => {
      console.log(CoinCap.coinData.length)
      console.log(CoinCap.coinData.length)
      console.log(CoinCap.exchangeRate.HKD)
      CoinCap.connectSocket()
    })
    .catch((error) => { console.log(error) })
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow()
  }
})

app.on('window-all-closed', () => {
  // if (process.platform !== "darwin")
  app.quit()
})

function createMainWindow () {
  const win = new BrowserWindow({
    width: 600,
    height: 400
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, '../html/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.on('closed', onClosed)
  return win
}

function onClosed () {
  // dereference the window
  // for multiple windows store them in an array
  mainWindow = null
}
