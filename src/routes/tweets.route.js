import { Router } from 'express';

// Models
import User from '../models/user.model';
import Tweet from '../models/tweet.model';
const passport = require('passport');

const tweetsRouter = new Router();

// Get 15 most recent tweets
tweetsRouter.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Tweet.find()
			.limit(15)
			.sort({ timestamp: -1 })
			.populate('author')
			.exec((err, tweets) => {
				if (err) {
					return res.status(400).json({
						message: "No tweets. There's an error",
					});
				}
				return res.status(200).json({
					user: req.user,
					tweets: tweets,
				});
			});
	}
);

// Get tweet by id
tweetsRouter.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Tweet.findById(req.params.id)
		.populate('replies')
		.populate('author')
			.exec((err, tweet) => {
				if (err) {
					res.send(500, 'No tweet found');
				}
				// return res.status(200).json(tweet);
				return res.json(tweet);
			});
	}
);

// Post new tweet
tweetsRouter.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { content } = req.body;
		const authorUsername = req.user.username;

		try {
			const author = await User.findOne({ authorUsername });

			const tweet = new Tweet({
				author: author,
				content: content,
			});

			await tweet.save();

			return res.status(201).json({
				message: 'Tweet Posted Succesfuly!',
				tweet: [tweet],
			});
		} catch (error) {
			console.log('Tweet Post Error', error);
			return res.status(400).json({
				message: 'Tweet Post Error',
				error: error,
			});
		}
	}
);

// FIXME: not working
// Edit tweet
tweetsRouter.put(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Tweet.findByIdAndUpdate(
			req.params.id,
			{ content: req.body.content },
			(err, tweet) => {
				if (err) {
					res.send(500, 'Error updating tweet');
				}
				// tweet.content = req.body.content;
				res.send(201, 'Tweet updated');
			}
		);
	}
);

// Delete tweet
tweetsRouter.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		console.log('Deleteing', req.params);
		Tweet.findByIdAndRemove(req.params.id, (err) => {
			if (err) {
				res.send(500, 'Error deleting tweet');
			}

			return res.json({ message: 'Tweet deleted' });
		});
	}
);

export default tweetsRouter;
