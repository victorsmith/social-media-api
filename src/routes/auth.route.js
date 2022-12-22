import { Router } from 'express';

const passport = require('passport');
import bcrypt from 'bcryptjs';
const LocalStrategy = require('passport-local').Strategy;

// User Model
import User from '../models/user.model';

const authRouter = new Router();

// Validation middleware
const { body, validationResult } = require('express-validator');

// JWT utils
const {
	issueJwt,
	generatePassword,
	comparePassword,
} = require('../utils/auth.utils');

// body('username').isAlphanumeric(),
// body('email').isAlphanumeric(),
// body('password').isLength({ min: 5 }),

// Register new user
authRouter.post('/register', async (req, res, next) => {
	// Validation result check
	// const validationErrors = validationResult(req);
	// if (!validationErrors.isEmpty()) {
	// 	res.send(400, "Validators failed")
	// 	// return res.status(400).json({ errors: validationErrors.array() });
	// 	return
	// }

	// Could do it in the middleware section
	const { username, email, password } = req.body;
	const hashedPassword = generatePassword(password);

	const user = new User({
		username: username,
		email: email,
		password: hashedPassword,
	});

	try {
		await user.save();
		// Issue JWT
		const token = issueJwt(user);

		console.log('Token', token);

		return res.status(201).json({
			message: 'Registration Succesful',
			token: token,
			user: {
				id: user._id, // default id property for mongo
				username: user.username,
				email: user.email,
			},
		});
	} catch (error) {
		return res.status(400).json({
			message: 'Registration error',
			error: error,
		});
	}
});
// Login
authRouter.post('/login', async (req, res, next) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (user) {
			const passwordCheck = comparePassword(password, user);

			if (passwordCheck) {
				const token = issueJwt(user);
				return res.status(201).json({
					message: 'Login Succesful',
					token: token,
					user: user.username,
				});
			} else {
				return res.status(401).json({
					message: 'Wrong Password. Accces denied',
				});
			}
		}
		return res.status(401).json({
			user: user.username,
			message: 'User Information',
		});
	} catch (error) {
		console.log('Error', error);
	}
});

authRouter.get(
	'/test',
	passport.authenticate('jwt', { session: false }),  // Passport middleware
	(req, res) => {
		res.status(200).json({
			message: 'auth route works',
			user: req.user
		});
	}
);

export default authRouter;
