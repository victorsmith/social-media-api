import { Router } from 'express';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
import bcrypt from 'bcryptjs';

// Models
import User from '../models/user.model';
import Tweet from '../models/tweet.model';

const tweetsRouter = new Router();

// Get 15 most recent tweets from followed users and return them
tweetsRouter
	.get('/', (req, res) => {
		Tweet.find({
			user: { $in: req.user.following },
		});
	})
	.limit(15)
	.sort({ timestamp: -1 })
	.exec((err, tweets) => {
		if (err) {
			res.send(err);
		}
		res.json(tweets);
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
  });
  tweet.save((err) => {
    if (err) {
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
    res.json(tweet);
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
