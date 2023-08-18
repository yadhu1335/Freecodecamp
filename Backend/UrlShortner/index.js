require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
let bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({ extended: true }));
  
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urldatabase={ };
let counter=1;
app.post('/api/shorturl', function(req, res) {
  const originalurl=req.body.url;
  try{
  const urlObject = new URL(originalurl);
  dns.lookup(urlObject.hostname , (err, address, family) => { 
    console.log(urlObject.hostname);
    console.log("urlobject:"+urlObject);
    console.log("originalurl:"+originalurl);
    if (err)
      res.json({ error: 'invalid url' });
    else {
      const shortid = counter;
      counter++;
      urldatabase[shortid]=originalurl;
      const response={
        original_url:originalurl,
        short_url:shortid,
      };
      console.log(response);
      res.json(response);
   }
  })
  }catch(error)
  {
    res.json({ error: 'invalid url' });
  }
})


//If given empty link
app.get('/api/shorturl/:shorturl',function(req,res){
  const id = req.params.shorturl;
  const originalurl=urldatabase[id];
//  res.redirect(originalurl);
    if (originalurl) {
    res.redirect(originalurl);
  } else {
    res.json({ error: 'short URL not found' });
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
