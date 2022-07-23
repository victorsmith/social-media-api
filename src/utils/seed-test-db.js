import User from '../models/user.model';

const generateUser = () => {
	const user = new User({
		username: 'John Doe',
		password: 'password',
		tweets: [],
		comments: [],
	}).save();
};

const generatePost = () => {};
const generateReply = () => {};

module.exports = {
	generateUser,
};
