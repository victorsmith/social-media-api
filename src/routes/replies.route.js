import { Router } from 'express';
import bcrypt from 'bcryptjs';
// User Model
import User from '../models/user.model';
import Tweet from '../models/tweet.model';
const passport = require('passport');

const replyRouter = new Router();

// Get all reply's the current logged in user has sent /*
replyRouter.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		Reply.find({ author: req.user }, (err, replies) => {
			if (err) {
				res.send(500, 'No replies found');
			}
			res.json(replies);
			res.send(200, 'Replies fetched');
		});
	}
);

// Get reply with :id
replyRouter.get(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		Reply.findById(req.params.id, (err, reply) => {
			if (err) {
				res.send(500, 'No reply found');
			}
			res.json(reply);
			res.send(200, 'Reply fetched');
		});
	}
);

// Post new reply to tweet
replyRouter.post(
	'/:tweetId',
	passport.authenticate('jwt', { session: false }),
	async (req, res, next) => {
		const { reply } = req.body;
		const { tweetId } = req.params;

		console.log("TweetID", tweetId);
		console.log("Reply", reply)
		
		const post = await Tweet.findOne({ _id: tweetId });
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		try {

			console.log("User", req.user);

			const newReply = {
				author: req.user,
				content: reply,
				parentTweet: tweetId,
			};

			const updatedReplies = [...post.replies, newReply]
			post.replies = updatedReplies;
			await post.save();

			return res.status(200).json(post);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Server Error' });
		}
	}
);

// Edit reply
replyRouter.put(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res, next) => {
		const { updatedContent } = req.body;
		try {
			const reply = await Reply.findOne({ _id: req.params.id });
			reply.content = updatedContent;
			await reply.save();
			res.status(200).json(reply);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server Error' });
		}
	}
);

// Delete reply with :id
replyRouter.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
		Reply.findByIdAndRemove(req.params.id, (err) => {
			if (err) {
				res.send(500, 'Error deleting tweet');
			}
			res.json({ message: 'Tweet deleted' });
		});
	}
);

export default replyRouter;
