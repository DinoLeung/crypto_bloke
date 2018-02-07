const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
var coinCap = require('./coinCap')

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// prevent window being garbage collected
let mainWindow

// var coinList, coinData;

app.on('ready', () => {
  mainWindow = createMainWindow()

  // Get initial data from CoinCap
  coinCap.fetchCoinData((error) => {
    if (error) console.log(error)
    else coinCap.connectSocket()
  })
  coinCap.fetchCoinName((error) => {
    if (error) console.log(error)
    else console.log('coinName')
  })
  coinCap.fetchExchangeRate((error) => {
    if (error) console.log(error)
    else console.log('exchangeRate')
  })
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
