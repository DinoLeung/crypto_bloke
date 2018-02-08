const electron = require('electron')
const io = require('socket.io-client')
const api = 'https://coincap.io/'

function fetch (key) {
  return new Promise((resolve, reject) => {
    var request = electron.net.request(api + key)
    request.on('response', (response) => {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(new Error('statusCode=' + response.statusCode))
      }
      var body = []
      response.on('data', (chunk) => body.push(chunk))
      response.on('end', () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString())
        } catch (e) {
          reject(e)
        }
        resolve(body)
      })
    })
    request.on('error', (error) => {
      reject(error)
    })
    request.end()
  })
}

var coinCap = module.exports = {
  coinData: [],
  coinName: [],
  exchangeRate: [],

  fetchCoinData: function () {
    return new Promise((resolve, reject) => {
      fetch('front').then((body) => {
        coinCap.coinData = body
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  },

  fetchCoinName: function () {
    return new Promise((resolve, reject) => {
      fetch('map').then((body) => {
        coinCap.coinName = body
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  },

  fetchExchangeRate: function () {
    return new Promise((resolve, reject) => {
      fetch('exchange_rates').then((body) => {
        coinCap.exchangeRate = body.rates
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  },

  connectSocket: function () {
    var socket = io(api)
    socket.on('trades', function (message) {
      // update coinData
      var index = coinCap.coinData.findIndex(obj => obj.short === message.coin)
      // var raise = message.msg.price > coinData[index].price;
      coinCap.coinData[index] = message.msg
    })
  }
}
