import { Router } from 'express';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
import bcrypt from 'bcryptjs';
// User Model
import User from '../models/user.model';

const sessionRouter = new Router();


// GET    /session/new gets the webpage that has the login form
sessionRouter.get('/new', (req, res) => {
	res.send(200, 'This endpoint would trigger a render of the login page');
});

// POST   /session authenticates credentials against database
sessionRouter.post(
	'/',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: 'new',
	})
);

// DELETE /session destroys session and redirect to login page
sessionRouter.delete('/', (req, res) => {
	// Built in PassportJS method which logs the user out
	req.logOut();
	res.redirect('new');
});


// GET  /Get current user 
// => Mostly for testing passportJS because I haven't done auth stuff recently
sessionRouter.get('/current-user', (req, res) => {
	res.send(req.user);
});

export default sessionRouter;