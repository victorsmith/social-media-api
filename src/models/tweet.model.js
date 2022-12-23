const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User' },
	content: { type: String },
	replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tweet', TweetSchema);
