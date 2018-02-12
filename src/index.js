// const {remote, ipcRenderer} = require('electron')
var CoinCap = require('../src/coinCap')
const io = require('socket.io-client')
// var socket = io('https://coincap.io/')

CoinCap.fetchCoinData()
  .then(() => {
    var html = '<table style="width:100%">'
    CoinCap.coinData.forEach(item => {
      html += '<tr id="' + item.short + '">'
      html += '<th>' + item.long + '</th>'
      html += '<th>' + item.price + '</th>'
      html += '</tr>'
    })
    html += '</table>'
    document.getElementById('coinTable').innerHTML = html
  })
  .then(() => {
    var socket = io('https://coincap.io/')
    socket.on('trades', (message) => {
      // update coinData
      var index = CoinCap.coinData.findIndex(obj => obj.short === message.coin)
      // var raise = message.msg.price > coinData[index].price;
      if (index < 0) {
        CoinCap.coinData.push(message.msg)
        index = global.coinData.length - 1
      } else {
        CoinCap.coinData[index] = message.msg
      }
      let th = document.getElementById(CoinCap.coinData[index].short)
      th.innerHTML = '<th>' + CoinCap.coinData[index].long + '</th><th>' + CoinCap.coinData[index].price + '</th>'
    })
  })
  .catch((error) => { console.log(error) })

// var testBtn = document.getElementById('testBtn')
// var testText = document.getElementById('testText')

// testBtn.addEventListener('click', function (event) {
// })

// ipcRenderer.on('ready', (event) => {
//   try {
//     var html = '<table style="width:100%">'
//     CoinCap.coinData.forEach(item => {
//       html += '<tr id="' + item.short + '">'
//       html += '<th>' + item.long + '</th>'
//       html += '<th>' + item.price + '</th>'
//       html += '</tr>'
//     })
//     // testText.innerText = CoinCap.coinData[0].long + ': ' + CoinCap.coinData[0].price
//     html += '</table>'
//     document.getElementById('coinTable').innerHTML = html
//   } catch (error) {
//     // do nothing
//   }
// })

// ipcRenderer.on('update', (event, index) => {
//   try {
//     // testText.innerText = CoinCap.coinData[0].long + ': ' + CoinCap.coinData[0].price
//     let th = document.getElementById(CoinCap.coinData[index].short)
//     th.innerHTML = '<th>' + CoinCap.coinData[index].long + '</th><th>' + CoinCap.coinData[index].price + '</th>'
//   } catch (error) {
//     // do nothing
//   }
// })
