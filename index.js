const express = require('express')
const { nanoid } = require('nanoid')
const {Url} = require('./db.js')
const {startDatabase} = require('./db.js')

startDatabase()

const app = express();
const jsonParser = express.json();

app.post(`/shorten`, jsonParser, async (req, res) => {
  try{
    const url = req.body.urlToShorten
    const token = nanoid()

    const newUrl = new Url({
      url,
      token,
    })

    await newUrl.save()

    const resData = {
      status: "Created",
      shortenedUrl: `http://localhost:3000/${token}`
    };

    res.status(201).json(resData)
  } catch (err) {
    res.status(400).json({ status: err.message })
  }
})

app.get(`/:url`, async (req, res) => {
  try {
    const token = req.params.url
    const longUrl = await Url.findOne({token})
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
    const longUrl = await Url.findOne({token})
    res.status(200).json({
      "viewCount": longUrl.views
    })
  } catch (err){
    res.status(400).json({ status: err.message })
  }
})

app.listen(3000, () => console.log('Server was started'))