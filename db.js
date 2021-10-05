const mongoose = require('mongoose');

const urlSchema = mongoose.Schema({
  views: {
    type: Number,
    default: 0  
  },
  token: String,
  url: String
})

function startDatabase(){
  mongoose.connect("mongodb://localhost:27017/test")
  const db = mongoose.connection
  db.on('error', (error) => console.error(error))
  db.once('open', () => console.log('Connected to Database'))
}

module.exports = {
  Url: mongoose.model('url', urlSchema),
  startDatabase
}