import { Router } from 'express';

const passport = require('passport');
import bcrypt from 'bcryptjs';
const LocalStrategy = require('passport-local').Strategy;

// User Model
import User from '../models/user.model';

const router = new Router();
const { body, validationResult } = require('express-validator');
const {getJwtData, issueJwt, generatePassword, comparePassword} = require('../utils/auth.utils');

// Register new user
router.post(
	'/register',
	// validation middleware
	body('username').isAlphanumeric(),
	body('email').isAlphanumeric(),
	body('password').isLength({ min: 5 }),
	async (req, res, next) => {
		// Validation result check
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// Could do it in the middleware section
		const { username, email, password } = req.body;
		const hashedPassword = generatePassword(password);

		const user = new User({
			username: username,
			email: email,
			password: hashedPassword,
		});

		user.save((err) => {
			if (err) {
				return res.send(500, 'Registration Error');
			}
			
			// Issue JWT
			const tokenObj = issueJWT(user);

			return res.status(201).json({
				message: 'Registration Succesful',
				token: tokenObj,
				user: {
					id: user._id, // default id property for mongo
					username: user.username,
					email: user.email,
				},
			});
		});	
	}
);
// Login
router.post('/login', async (req, res, next) => {});

router.get('/test', (req, res) => {
	res.status(200).json({
		message: "auth route works",
	})
})

export default router;
