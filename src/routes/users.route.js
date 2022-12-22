import { Router } from 'express';
import bcrypt from 'bcryptjs';
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
			res.json(users);
			res.send(200, 'Users fetched');
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
			res.json(user);
			res.send(200, 'Users fetched');
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
			res.json(user.following);
			res.send(200, 'Users fetched');
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
			res.json(user.followers);
			res.send(200, 'Users fetched');
		});
	}
);

// Get user with :username (username is a primary key)
usersRouter.get(
	'/:username',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {}
);


// Follow user with :username
usersRouter.post(
	'/:username/follow',
	passport.authenticate('jwt', { session: false }),
	async (req, res, next) => {
		const { username } = req.params;

		try {
			const userToFollow = await User.findOne({ username: username });

			if (!userToFollow) {
				return res.status(404).json({ message: 'User not found' });
			}

			if (userToFollow.username === req.user.username) {
				return res
					.status(400)
					.json({ message: 'You cannot follow yourself' });
			}

			if (userToFollow.followers.includes(req.user.username)) {
				return res
					.status(400)
					.json({ message: 'You already follow this user' });
			}

			userToFollow.followers.unshift(req.user.username);
			await userToFollow.save();
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
