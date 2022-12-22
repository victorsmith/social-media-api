import { Router } from 'express';
import bcrypt from 'bcryptjs';
const passport = require('passport');

// User Model
import User from '../models/user.model';

const usersRouter = new Router();

// Get all users => Should require an internal admin API key for secuirty reasons
usersRouter.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		User.find({}, (err, users) => {
			if (err) {
				res.send(500, 'No users found');
			}
			res.status(200).json(users);
		});
	}
);

// Get current logged in user
usersRouter.get(
	'/me',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		User.findOne({ username: req.user.username }, (err, user) => {
			if (err) {
				res.send(500, 'No users found');
			}
		});
	}
);

// Get all users that the current logged in user follows
usersRouter.get(
	'/following',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		User.findOne({ username: req.user.username }, (err, user) => {
			if (err) {
				res.send(500, 'No users found');
			}
			res.status(200).json(user.following);
		});
	}
);

// Get all users that follow the current logged in user
usersRouter.get(
	'/followers',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		User.findOne({ username: req.user.username }, (err, user) => {
			if (err) {
				res.send(500, 'No users found');
			}
			res.status(200).json(user.followers);
		});
	}
);

// Get user with :username (username is a primary key)
usersRouter.get(
	'/:username',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		User.findOne({ username: req.user.username }, (err, user) => {
			if (err) {
				res.send(500, 'No users found');
			}

			// Never send back the password of the user
			const { _id, username, tweets, followers, following } = req.user;
			res.status(200).json({
				id: _id,
				username: username,
				tweets: tweets,
				followers: followers,
				following: following,
			});
		});
	}
);

// FIXME:
// Follow user with :username
usersRouter.post(
	'/:username/follow',
	passport.authenticate('jwt', { session: false }),
	async (req, res, next) => {
		const { username } = req.params;
		const me = req.user.username;

		console.log('##ME', me);

		try {
			const follower = await User.findOne({ username: me });
			const followed = await User.findOne({ username: username });

			if (!followed) {
				res.status(404).json({ message: 'User not found' });
			}

			if (followed.username === me) {
				res.status(400).json({ message: 'You cannot follow yourself' });
			}

			console.log("Follwed:", followed);
			console.log("Follwed:", followed.followers);

			if (followed.followers.includes(me)) {
				res.status(400).json({
					message: 'You already follow this user',
				});
			}

			const updatedFollowing = [...follower.following, followed];
			const updatedFollowers = [...followed.followers, follower];

			follower.following = updatedFollowing;
			followed.followers = updatedFollowers;

			await follower.save();
			await followed.save();

			return res.status(201).json({
				message: 'Follow succesful',
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server Error' });
		}
	}
);

// Unfollow user with :username
usersRouter.post(
	'/:username/unfollow',
	passport.authenticate('jwt', { session: false }),
	async (req, res, next) => {
		const { username } = req.params;

		try {
			const userToUnfollow = await User.findOne({ username: username });

			if (!userToUnfollow) {
				return res.status(404).json({ message: 'User not found' });
			}

			if (userToUnfollow.username === req.user.username) {
				return res
					.status(400)
					.json({ message: 'You cannot unfollow yourself' });
			}

			if (!userToUnfollow.followers.includes(req.user.username)) {
				return res
					.status(400)
					.json({ message: 'You do not follow this user' });
			}

			const removeIndex = userToUnfollow.followers.indexOf(
				req.user.username
			);
			userToUnfollow.followers.splice(removeIndex, 1);
			await userToUnfollow.save();
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server Error' });
		}
	}
);

// Edit profile of logged in user
usersRouter.put(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		const { username, email, password } = req.body;

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		User.findOneAndUpdate(
			{ username: req.user.username },
			{ username: username, email: email, password: hash },
			(err, user) => {
				if (err) {
					res.send(500, 'No users found');
				}
				res.status(201).send('User updated');
			}
		);
	}
);

// Delete user with :username
usersRouter.delete(
	'/:username',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		User.findOne({ username: req.params.username }, (err, user) => {
			if (err) {
				res.send(500, 'User not found');
			}
			user.remove();
			res.send(200, 'User deleted');
		});
	}
);

export default usersRouter;
