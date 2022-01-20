const https = require('https')
const fs = require('fs')

https.get('https://api.sampleapis.com/bitcoin/historical_prices', (res) => {
  res.pipe(fs.createWriteStream('prices.json'))
})