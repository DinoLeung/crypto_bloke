const electron = require('electron')
const io = require('socket.io-client')
const API = 'https://coincap.io/'

function fetch (key) {
  return new Promise(function (resolve, reject) {
    var request = electron.net.request(API + key)
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

  fetchCoinData: function (callback) {
    fetch('front').then((body) => {
      coinCap.coinData = body
      return callback()
    }).catch((error) => {
      return callback(error)
    })
  },

  fetchCoinName: function (callback) {
    fetch('map').then((body) => {
      coinCap.coinName = body
      return callback()
    }).catch((error) => {
      return error
    })
  },

  fetchExchangeRate: function (callback) {
    fetch('exchange_rates').then((body) => {
      coinCap.exchangeRate = body.rates
      return callback()
    }).catch((error) => {
      return callback(error)
    })
  },

  connectSocket: function () {
    var socket = io(API)
    socket.on('trades', function (message) {
      // update coinData
      var index = coinCap.coinData.findIndex(obj => obj.short === message.coin)
      // var raise = message.msg.price > coinData[index].price;
      coinCap.coinData[index] = message.msg
    })
  }
}
