const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'User' },
	content: { type: String, required: true },
	parentTweet: { type: Schema.Types.ObjectId, ref: 'Tweet' },
	replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Reply', ReplySchema);
