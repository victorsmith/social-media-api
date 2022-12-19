import { Router } from 'express';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
import bcrypt from 'bcryptjs';
// User Model
import User from '../models/user.model';

const sessionRouter = new Router();


// GET /session
sessionRouter.get('/', (req, res) => {
	res.send(req.user);
});

// GET /session/new 
sessionRouter.get('/new', (req, res) => {
	res.send(200, 'This endpoint trigger a render of the login page');
});

// POST /session
sessionRouter.post(
	'/',
	// Functions are handled inside 'utils/passport-utils'
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

export default sessionRouter;