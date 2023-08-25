// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/timestamp/", function (req, res) {
  res.json({'unix': Date.now(), 'utc': Date()});
});

// returning current date and time accepting either unix or valid date, or error otherwise... 
app.get("/api/", function (req, res) {
  res.json({'unix': Date.now(), 'utc': Date()});
});

app.get("/api/:date", (req, res) => {
  let dateString = req.params.date;

  if (!isNaN(Date.parse(dateString))) {
    let dateObject = new Date(dateString);
    res.json({ unix: dateObject.valueOf(), utc: dateObject.toUTCString() });
  } else if (/\d{5,}/.test(dateString)) {
      let dateInt = parseInt(dateString);
      res.json({ unix: dateInt, utc: new Date(dateInt).toUTCString() });
  } else {
    res.json({ error: "Invalid Date" });
  }

});



// // // your first API endpoint... 
// // app.get("/api/hello", function (req, res) {
// //   res.json({greeting: 'hello API'});
// // });

// app.get('/api/:date', function(req, res) {
//   let a = req.params.date;
//   let b = new Date(a);
//    const timestamp = parseInt(a, 10);
//   if (!isNaN(Date.parse(a))&&b!='Invalid Date') {
//     console.log("Date");
//     let unix = b.getTime();
//     let utc = b.toUTCString();
//     res.json({ unix: unix, utc: utc });
//    }
//    else if(!isNaN(timestamp) && timestamp >= 0){
//      console.log("Unix");
//       let c= new Date(a*1000);
//       const options = { weekday: 'short', day: 'numeric', 
//       month: 'short', year: 'numeric', timeZone: 'UTC' };
//       const utcString = c.toLocaleString('en-US', options);
//       res.json({"unix": a, utc:utcString});
//     }
  
//     else{
//      console.log("invalid");
//     res.json({
//       error: "Invalid Date"
//     });
//   }
//   // else {
//   //   let c= new Date(a*1000);
//   // const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' };
//   // const utcString = c.toLocaleString('en-US', options);
    
//   // res.json({"unix": a, utc:utcString});
//   // }
// });

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
