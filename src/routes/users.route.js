import { Router } from 'express';
import bcrypt from 'bcryptjs';
// User Model
import User from '../models/user';

const usersRouter = new Router();

// GET  /users/new => gets the webpage that has the registration form
usersRouter.get('/new', (req, res) => {
	res.send('This endpoint would trigger a render of the register page');
});

// POST /users => records the entered information into database as a new /user/:id
usersRouter.post('/', (req, res) => {
	// Scrub input here for database safety if you have time
	bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
		if (err) {
			return next(err);
		}
		const user = new User({
			username: req.body.username,
			password: hashedPassword,
		}).save((err) => {
			if (err) {
				res.send('Error creating user');
			}
			// Redirect to login page once user has been registered
			res.redirect('login');
		});
	});
});

// GET  /users/xxx => gets and renders current user data in a profile view
// POST /users/xxx => updates new information about user
