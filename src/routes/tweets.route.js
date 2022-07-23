import { Router } from 'express';

// Models
import Tweet from '../models/tweet.model';

const tweetsRouter = new Router();

// Get 15 most recent tweets
tweetsRouter.get('/', (req, res) => {
	Tweet.find()
		.limit(15)
		.sort({ timestamp: -1 })
		.exec((err, tweets) => {
			if (err) {
				res.send(500, "No tweets found");
			}
			res.json(tweets);
		});
});

// Get tweet by id
tweetsRouter.get('/:id', (req, res) => {
	Tweet.findById(req.params.id, (err, tweet) => res.json(tweet));
});

// Post new tweet
tweetsRouter.post('/', (req, res) => {
	const tweet = new Tweet({
		user: req.user,
		content: req.body.content,
	}).save((err) => {
		if (err) {
			console;
			res.send(err);
		}
		res.json(tweet);
	});
});

// Edit tweet
tweetsRouter.put('/:id', (req, res) => {
	Tweet.findByIdAndUpdate(req.params.id, req.body, (err, tweet) => {
		if (err) {
			res.send(err);
		}
    res.send(201, "Tweet updated");
	});
});

// Delete tweet
tweetsRouter.delete('/:id', (req, res) => {
	Tweet.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.send(err);
		}
		res.json({ message: 'Tweet deleted' });
	});
});

export default tweetsRouter;