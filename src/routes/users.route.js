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

// Follow user with :username
usersRouter.post(
	'/:username/follow',
	passport.authenticate('jwt', { session: false }),
	async (req, res, next) => {
		const { username } = req.params;

		console.log('Username:', username);
		console.log('Logged in user:', req.user.username);

		try {
			const userToFollow = await User.findOne({ username: username });
			console.log('user to follow:', userToFollow.username);

			if (!userToFollow) {
				console.log('A');
				res.status(404).json({ message: 'User not found' });
			}

			if (userToFollow.username === req.user.username) {
				console.log('b');
				res.status(400).json({ message: 'You cannot follow yourself' });
			}

			if (userToFollow.followers.includes(req.user.username)) {
				console.log('c');
				res.status(400).json({
					message: 'You already follow this user',
				});
			}

			User.update(
				{ username: username },
				{
					$push: { followers: username },
				},
				(err, done) => {
					if (err) {
						res.status(500).json({
							message: 'Server Error. Update not completed.',
						});
					}

					console.log('Done', done);
					res.status(201).json({
						message: `User: ${req.user.username} succesfully followed ${username}`,
					});
				}
			);
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
				res.send(200, 'User updated');
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
