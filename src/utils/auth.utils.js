const ExtractJwt = require('passport-jwt').ExtractJwt;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'private-key.pem');
const PRIVATE_KEY = fs.readFileSync(pathToKey, 'utf8');

// Extracts user info from JWT 
function getJwtData(req, res, next) {
	if (!req.user) {
		// Bearer token?
		const requestJwt = ExtractJwt.fromAuthHeaderAsBearerToken();
		const payload = jwt.verify(requestJwt(req), process.env.JWT_SECRET);
	} else {
		req.payload = req.user;
	}
	next();
}

// Issues a JWT
const issueJwt = (user) => {
	const _id = user._id;
	const expiresIn = '1d';

	const payload = {
		id: _id,
		iat: Date.now(),
	};

	const signedToken = jwt.sign(payload, PRIVATE_KEY, {
		expiresIn: expiresIn,
		algorithm: 'RS256',
	});

	return {
		token: 'Bearer ' + signedToken,
		expires: expiresIn,
	};
};

// Generate a secure password
function generatePassword(password) {
	const encryptedPassword = bcrypt.hashSync(password, 10);
	console.log('ePassword', encryptedPassword);
	return encryptedPassword;
}

// Compare user password to the input provided
function comparePassword(password, user) {
	return bcrypt.compare(password, user.password);
}

module.exports.getJwtData = getJwtData;
module.exports.issueJwt = issueJwt;
module.exports.generatePassword = generatePassword;
module.exports.comparePassword = comparePassword;
