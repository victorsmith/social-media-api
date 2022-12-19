const LocalStrategy = require('passport-local').Strategy;
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

function initialize(passport) {
	passport.use(
		new LocalStrategy((username, password, done) => {
			console.log('username', username);
			console.log('password', password);

			User.findOne({ username: username }, (err, user) => {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, { message: 'Incorrect username' });
				}

				bcrypt.compare(password, user.password, (err, res) => {
					if (res) {
						// passwords matches
						console.log('match', res);
						return done(null, user);
					} else {
						// passwords does not match
						console.log('not match', res);
						return done(null, false, {
							message: 'Incorrect password',
						});
					}
				});

				// TODO: need this ?
				// return done(null, user);
			});
		})
	);

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
}

// module.exports = initialize;
