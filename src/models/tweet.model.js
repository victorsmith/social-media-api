const mongoose = require('mongoose');
const Schema = mongoose.Schema;
import User from './user';

const TweetSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User' },
	content: { type: String, required: true },
	replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Tweet', TweetSchema);
