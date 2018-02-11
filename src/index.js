const {remote, ipcRenderer} = require('electron')
var CoinCap = remote.require('./coinCap')

// var testBtn = document.getElementById('testBtn')
// var testText = document.getElementById('testText')

// testBtn.addEventListener('click', function (event) {
// })

ipcRenderer.on('ready', (event) => {
  try {
    var html = '<table style="width:100%">'
    CoinCap.coinData.forEach(item => {
      html += '<tr id="' + item.short + '">'
      html += '<th>' + item.long + '</th>'
      html += '<th>' + item.price + '</th>'
      html += '</tr>'
    })
    // testText.innerText = CoinCap.coinData[0].long + ': ' + CoinCap.coinData[0].price
    html += '</table>'
    document.getElementById('coinTable').innerHTML = html
  } catch (error) {
    // do nothing
  }
})

ipcRenderer.on('update', (event, index) => {
  try {
    // testText.innerText = CoinCap.coinData[0].long + ': ' + CoinCap.coinData[0].price
    let th = document.getElementById(CoinCap.coinData[index].short)
    th.innerHTML = '<th>' + CoinCap.coinData[index].long + '</th><th>' + CoinCap.coinData[index].price + '</th>'
  } catch (error) {
    // do nothing
  }
})
