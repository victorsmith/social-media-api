import { Router } from 'express';
import bcrypt from 'bcryptjs';
// User Model
import User from '../models/user.model';
import Tweet from '../models/tweet.model';

const replyRouter = new Router();

// Get all reply's the current logged in user has sent /*
replyRouter.get('/', (req, res, next) => {
  Reply.find({ author: req.user }, (err, replies) => {
    if (err) {
      res.send(500, "No replies found");
    }
    res.json(replies)
    res.send(200, "Replies fetched");
  });
});

// Get reply with :id
replyRouter.get('/:id', (req, res, next) => {
  Reply.findById(req.params.id, (err, reply) => {
    if (err) {
      res.send(500, "No reply found");
    }
    res.json(reply)
    res.send(200, "Reply fetched");
  });
});

// Post new reply to tweet
replyRouter.post('/:tweetId', async (req, res, next) => {
	const { tweetId, reply } = req.body;
	const post = await Tweet.findOne({ _id: tweetId });

	if (!post) {
		return res.status(404).json({ message: 'Post not found' });
	}

	try {
		const newComment = {
			author: req.user,
			content: reply,
			parentTweet: tweetId,
		};
		post.comments.unshift(newComment);
		await post.save();
		res.status(200).json(post.comments);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
});

// Edit reply
replyRouter.put('/:id', async (req, res, next) => {
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
});

// Delete reply with :id
replyRouter.delete('/:id', (req, res, next) => {
  Reply.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.send(500, 'Error deleting tweet');
		}
		res.json({ message: 'Tweet deleted' });
  });
});

export default replyRouter;
