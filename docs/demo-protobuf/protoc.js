const fs = require('fs')
const protos = require('./prices_pb')
const pricesData = require('./prices.json')

const prices = new protos.Prices()
for (const priceData of pricesData) {
  const price = new protos.Price()
  price.setDate(priceData.Date)
  price.setPrice(priceData.Price)
  price.setOpen(priceData.Open)
  price.setHigh(priceData.High)
  price.setChangepercentfromlastmonth(priceData.ChangePercentFromLastMonth)
  price.setVolume(priceData.Volume)
  
  // const serialized = price.serializeBinary();
  // console.log(serialized)
  // console.log(serialized.toString())
  // var deserialized = protos.Price.deserializeBinary(serialized);
  // console.log(deserialized)
  // console.log(deserialized.toString())
  
  prices.addPrices(price)
}

const serialized = prices.serializeBinary();
// console.log(serialized)
// console.log(serialized.toString())
// var deserialized = protos.Prices.deserializeBinary(serialized);
// console.log(deserialized)
fs.writeFileSync('prices', serialized)
// ---
const pricesFromFile = fs.readFileSync('prices')
const pricesDeserialized = protos.Prices.deserializeBinary(serialized);
// console.log(deserialized)

for (const price of pricesDeserialized.getPricesList()) {
  console.log(price.toObject())
}