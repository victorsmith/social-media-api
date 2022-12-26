const LocalStrategy = require('passport-local').Strategy;
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import { Strategy, ExtractJwt } from 'passport-jwt';

import fs from 'fs';
import path from 'path';

const pathToKey = path.join(__dirname, '..', 'private-key.pem');
const publicKey = fs.readFileSync(pathToKey, 'utf-8');

// Could add a cookie extractor here

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: publicKey,
	algorithms: ['RS256'],
};

const jwtStrategy = new Strategy(options, (payload, done) => {

	User.findOne({ _id: payload.id })
		.then((user) => {
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		})
		.catch((error) => done(error, null));
});

function initializePassport(passport) {
	console.log("Initialized Passport JS")
	// console.log("Strat Object", jwtStrategy)
	passport.use(jwtStrategy);
}

// initialize(passport);

module.exports = initializePassport;
