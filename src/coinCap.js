const {net} = require('electron')
const io = require('socket.io-client')
const api = 'https://coincap.io/'

function fetch (key) {
  return new Promise((resolve, reject) => {
    var request = net.request(api + key)
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

module.exports = {
  coinData: [],
  coinName: [],
  exchangeRate: [],

  fetchCoinData: function () {
    return new Promise((resolve, reject) => {
      fetch('front').then((body) => {
        this.coinData = body
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  },

  fetchCoinName: function () {
    return new Promise((resolve, reject) => {
      fetch('map').then((body) => {
        this.coinName = body
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  },

  fetchExchangeRate: function () {
    return new Promise((resolve, reject) => {
      fetch('exchange_rates').then((body) => {
        this.exchangeRate = body.rates
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  },

  connectSocket: function () {
    var socket = io(api)
    socket.on('trades', (message) => {
      // update coinData
      var index = this.coinData.findIndex(obj => obj.short === message.coin)
      // var raise = message.msg.price > coinData[index].price;
      if (index < 0) {
        this.coinData.push(message.msg)
        index = global.coinData.length - 1
      } else {
        this.coinData[index] = message.msg
      }
      // send update event to main process
      global.coinCapSocketEmitter.emit('coinCap-update', index)
    })
  }
}
