var JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;

import User from '../src/models/user.model';

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";

module.exports = new JwtStrategy(opts, function (jwt_payload, done) {
	User.findOne({ _id: jwt_payload.id }, function (err, user) {
		if (err) {
			return done(err, false);
		}
		if (user) {
			return done(null, user);
		} else {
			return done(null, false);
			// or you could create a new account
		}
	});
});
