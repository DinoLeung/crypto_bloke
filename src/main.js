const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
// var CoinCap = require('./coinCap')

const Events = require('events')
// declare a global event object for CoinCap socket updates
global.coinCapSocketEmitter = new Events()

// adds debug features like hotkeys for triggering dev tools and reload
// require('electron-debug')()
const devMode = true

// prevent window being garbage collected
let mainWindow

app.on('ready', () => {
  mainWindow = createMainWindow()

  // Get initial data from CoinCap
  // CoinCap.fetchCoinData()
  // .then(() => { return CoinCap.fetchExchangeRate() })
  // .then(() => { return CoinCap.fetchCoinName() })
  // .then(() => {
  // send ready event to mainWindow
  //   mainWindow.webContents.send('ready')
  //   CoinCap.connectSocket()
  // })
  // .catch((error) => { console.log(error) })
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow()
  }
})

// catch update events from CoinCap
// global.coinCapSocketEmitter.on('coinCap-update', (index) => {
//   // send update event to mainWindow
//   mainWindow.webContents.send('update', index)
// })

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

  // show dev tool
  if (devMode) win.webContents.openDevTools()

  win.on('closed', onClosed)
  return win
}

function onClosed () {
  // dereference the window
  // for multiple windows store them in an array
  mainWindow = null
}
