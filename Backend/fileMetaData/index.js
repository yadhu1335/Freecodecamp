var express = require('express');
var cors = require('cors');
require('dotenv').config()
var multer=require('multer');//is used to get the uploded files and its information
var upload=multer({dest:'uploads/'});//to save the sended file from user

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse',upload.single('upfile'),function(req,res){//in upload.singe()we should give the name given in the form
  try{
    var name=req.file.originalname;
    var path=req.file.path;
    var size=req.file.size;
    var type=req.file.mimetype;
    console.log("name="+name+"path="+path+"type="+type+"Size"+size);
    res.json({
      name:name,
      type:type,
      size:size,
    })
  }
  catch(err){
    console.log("err="+err);
  }
})




const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
