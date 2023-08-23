const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mySecret = process.env['MONGO_URI']
//mongoose
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });
let exerciseUser;
let exerciseDesc;
const exerciseDescSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, min: 1, required: true },
  date: { type: Date, default: Date.now }
});

const exerciseUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

exerciseUser = mongoose.model('exerciseUser', exerciseUserSchema);
exerciseDesc = mongoose.model('exerciseDesc', exerciseDescSchema);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', function(req, res) {
  let username = req.body.username;
  let yadhu = new exerciseUser({
    username: username,
  });
  let id;
  yadhu.save()
    .then(function(data) {//new way
    id = data['_id'];
    console.log("Data=" + data);
    res.json({
      username: username,
      _id: id,
    });
  })
  .catch(function(err){
    console.log(err);
  })
})

app.post('/api/users/:_id/exercises', async function (req, res) {
	try {
		const userId = req.params._id;

		if (!userId) {
			return res.json({ error: '_id is required' });
		}

		const description = req.body.description;
		const duration = parseInt(req.body.duration);
		const date = req.body.date ? new Date(req.body.date) : new Date();
		const user = await exerciseUser.findById(userId);
		const newExercise = new exerciseDesc({
			id: userId,
			description: description,
			duration: duration,
			date: date
		});
		const savedExercise = await newExercise.save();
		res.json({
			_id: userId,
			username: user.username,
			description: savedExercise.description,
			duration: savedExercise.duration,
			date: savedExercise.date.toDateString()
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "An error occurred" });
	}
});//gpt

app.get('/api/users/:_id/exercises', function (req, res) {
	res.redirect('/api/users/' + req.params._id + '/logs');
});//gpt


app.get('/api/users',async function(req, res){
  try{
  let getOutput= await exerciseUser.find();
  let responseArray=getOutput.map(function(user){
    return {
      _id:user._id,
      username:user.username,
    }
    console.log("The data has been retrieved succesfully");
  });
   res.json(responseArray);
     }
  catch (err) {
    console.error(err);
  }
})
//To find the log of all the changed exercises
app.get('/api/users/:_id/logs', async function(req, res) {
  try {
    let userId = req.params._id;
    let from = req.query.from;
    let to = req.query.to;
    let limit = parseInt(req.query.limit);

    let user = await exerciseUser.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Build the query to retrieve exercise logs based on parameters
    let query = { id: userId };
    if (from) {
      query.date = { $gte: new Date(from) };
    }
    if (to) {
      query.date = { ...query.date, $lte: new Date(to) };
    }
     console.log(query.date);
    // Find exercise logs based on the query
    let exerciseLogs = await exerciseDesc.find(query).limit(limit || 0);

    // Get the count of exercise logs
    let exerciseCount = exerciseLogs.length;

    // Prepare the response object
    //in .map during the call in 1st iteration it gives the first datas of log -by me 
    let formattedLogs = exerciseLogs.map(log => ({
      description: log.description,
      duration: log.duration,
      date: log.date.toDateString(),
    }));
    let response = {
      _id: userId,
      username: user.username,
      count: exerciseCount,
      log: formattedLogs,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


