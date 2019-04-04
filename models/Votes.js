const mongoose = require('mongoose');

const { Schema } = mongoose;

const VotesSchema = new Schema(
  {
    repoName: String,
    voteAmount: Number,
    emailAddress: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Votes', VotesSchema);
