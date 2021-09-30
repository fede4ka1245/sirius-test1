const mongoose = require(`mongoose`);

const urlSchema = mongoose.Schema({
  views: {
    type: Number,
    default: 0  
  },
  token: String,
  url: String
})

module.exports = mongoose.model(`url`, urlSchema);