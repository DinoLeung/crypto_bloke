const {remote, ipcRenderer} = require('electron')
var CoinCap = remote.require('./coinCap')

var testBtn = document.getElementById('testBtn')
var testText = document.getElementById('testText')

testBtn.addEventListener('click', function (event) {
})

ipcRenderer.on('ready', (event, index) => {
  testText.innerText = JSON.stringify(CoinCap.coinData[0])
})

ipcRenderer.on('update', (event, index) => {
  // show btc only atm
  testText.innerText = JSON.stringify(CoinCap.coinData[0])
  // testText.innerText = JSON.stringify(CoinCap.coinData[index])
})
