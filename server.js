// key values hidden using .env file -- do not commit
// via https://github.com/motdotla/dotenv
require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Votes = require('./models/Votes');

const API_PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
const router = express.Router();

const userPass = `${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}`;
const dbRoute = `mongodb+srv://${userPass}@jack-star-repo-igtwd.mongodb.net/test?retryWrites=true`;

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

const db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/votes', (req, res) => {
  Votes.aggregate([
    { $group: { _id: '$repoName', totalVotes: { $sum: 1 } } },
    { $project: { totalVotes: '$totalVotes' } }
  ])
    .then(data => res.json({ success: true, data }))
    .catch(err => {
      return res.json({ success: false, error: err });
    });
});

router.post('/votes', (req, res) => {
  const data = new Votes();
  const { repoName } = req.body;

  if (!repoName && repoName !== '') {
    return res.json({
      success: false,
      error: 'INVALID INPUTS'
    });
  }

  data.repoName = repoName;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });

  return res.json({ success: false, error: 'Something unexpected went wrong' });
});

app.use('/api', router);

app.listen(port, () => console.log(`Example app listening on port ${port}`));

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
