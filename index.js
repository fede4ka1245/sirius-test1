const express = require('express')
const { nanoid } = require('nanoid')
const Url = require(`./db.js`)
const mongoose = require(`mongoose`);

const app = express();
const jsonParser = express.json();

mongoose.connect("mongodb://localhost:27017/usersdb")
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.post(`/shorten`, jsonParser, async (req, res) => {
  try{
    let url = req.body.urlToShorten
    let token = nanoid()

    const newUrl = new Url({
      url: url,
      token: token,
    })

    await newUrl.save()

    let resData = {
      status: "Created",
      shortenedUrl: `http://localhost:3000/${token}`
    };

    res.status(201).send(JSON.stringify(resData))
  } catch (err) {
    res.status(400).json({ status: err.message })
  }
})

app.get(`/:url`, async (req, res) => {
  try {
    const token = req.params.url
    const longUrl = await Url.findOne({token: token})
    await Url.updateOne(longUrl, {views: longUrl.views + 1})
    res.redirect(longUrl.url)
    // res.status(301).send(JSON.stringify({
    //   redirectTo: longUrl
    // }))
  } catch (err){
    res.status(400).json({ status: err.message })
  }
})

app.get(`/:url/views`, async (req, res) => {
  try {
    const token = req.params.url
    const longUrl = await Url.findOne({token: token})
    let viewCount = longUrl.views
    res.status(200).send(JSON.stringify({
      "viewCount": viewCount
    }))
  } catch (err){
    res.status(400).json({ status: err.message })
  }
})

app.listen(3000);