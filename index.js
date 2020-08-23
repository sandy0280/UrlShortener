const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./modals/shortUrl')
const app = express()


mongoose.connect('mongodb://localhost/urlShortener', {
   useNewUrlParser : true, 
   useFindAndModify:true,
   useUnifiedTopology : true  
}).catch(err => console.error(error))

app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', async (req,res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index',{shortUrls : shortUrls})
})

app.post('/shortUrls', async (req,res) => {
  await  ShortUrl.create({ full: req.body.fullurl })
  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short : req.params.shortUrl })
  if(shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++;
  shortUrl.save()

  res.redirect(shortUrl.full)
})



app.listen(process.env.PORT || 3000);