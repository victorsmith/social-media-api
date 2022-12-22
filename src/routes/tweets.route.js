import { Router } from 'express';

// Models
import Tweet from '../models/tweet.model';

const tweetsRouter = new Router();

// Get 15 most recent tweets
tweetsRouter.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Tweet.find()
			.limit(15)
			.sort({ timestamp: -1 })
			.exec((err, tweets) => {
				if (err) {
					res.send(500, 'No tweets found');
				}
				res.json(tweets);
				res.send(200, 'Tweets fetched');
			});
	}
);

// Get tweet by id
tweetsRouter.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Tweet.findById(req.params.id, (err, tweet) => {
			if (err) {
				res.send(500, 'No tweet found');
			}
			res.json(tweet);
			res.send(200, 'Tweet fetched');
		});
	}
);

// Post new tweet
tweetsRouter.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const tweet = new Tweet({
			user: req.user,
			content: req.body.content,
		}).save((err) => {
			if (err) {
				res.send(500, 'Error posting tweet');
			}
			res.send(201, 'Tweet posted');
		});
	}
);

// Edit tweet
tweetsRouter.put(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Tweet.findByIdAndUpdate(req.params.id, req.body, (err, tweet) => {
			if (err) {
				res.send(500, 'Error updating tweet');
			}
			// tweet.content = req.body.content;
			res.send(201, 'Tweet updated');
		});
	}
);

// Delete tweet
tweetsRouter.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Tweet.findByIdAndRemove(req.params.id, (err) => {
			if (err) {
				res.send(500, 'Error deleting tweet');
			}
			res.json({ message: 'Tweet deleted' });
		});
	}
);

export default tweetsRouter;