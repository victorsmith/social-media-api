const mongoose = require('mongoose');
const Schema = mongoose.Schema;
import uniqueValidator from 'mongoose-unique-validator';
// var findOrCreate = require('mongoose-findorcreate');

const UserSchema = new Schema({
	username: { type: String, required: true, index: true, unique: true },
	password: { type: String, required: true },
	tweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
	comments: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
	followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

// Unique validator => Prevents duplicate user names
UserSchema.plugin(uniqueValidator);
// UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);
