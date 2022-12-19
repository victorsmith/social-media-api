import express from 'express';
import session from 'express-session';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv/config';

import passport from 'passport';
import initializePassport from './utils/passport-utils';

import routes from './routes';

// DB CONFIG CODE
import mongoDB from './utils/db-config';

// Passport Stratergies
const jwtStrategy = require('../passport/jwt');

// Init passport using function from passport-utils.
passport.use(jwtStrategy);

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

// PassportJS Stuff
app.use(passport.initialize());
app.use(passport.session());
passport.use(jwtStrategy);

app.use('/auth', routes.auth);
app.use('/users', routes.users);
app.use('/session', routes.session);
app.use('/tweets', routes.tweets);

// Implement better routing if time is available later => this is kinda messy
// app.use('/api', routes.index);

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
