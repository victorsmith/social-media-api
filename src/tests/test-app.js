import express from 'express';
import session from 'express-session';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv/config';

import passport from 'passport';
import initializePassport from '../utils/passport-utils';

import routes from '../routes';

// DB CONFIG CODE
import testdb from '../utils/test-db-config';

// Init passport using function from passport-utils.
initializePassport(passport);

const app = express();

// Application Level Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', routes.users);

app.get('/', (req, res) => {
	res.send(200, 'Home Page');
});


module.exports = app;
