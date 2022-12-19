import { Router } from 'express';
import bcrypt from 'bcryptjs';
// User Model
import User from '../models/user.model';

const usersRouter = new Router();

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
				console.log(err);
				// return next(err);	
				res.send(500, "Duplicate Username");
			}
			// Redirect to login page once user has been registered 
			res.send(201, "Registration succesful")
			// res.redirect('/session/new');
		});
	});
});

// GET  /users/xxx => gets and renders current user data in a profile view


// PUT /users/:id => updates new information about user
usersRouter.put('/:id', (req, res) => {})


export default usersRouter;
