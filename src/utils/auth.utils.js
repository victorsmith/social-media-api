const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ExtractJwt = require("passport-jwt").ExtractJwt;

function getJwtData (req, res, next) {
  
  if (!req.user) {
    // Bearer token?
    const requestJwt = ExtractJwt.fromAuthHeaderAsBearerToken()
    const payload = jwt.verify(requestJwt(req), process.env.JWT_SECRET);
  } else {
    req.payload = req.user;
  }
  next();
}

const issueJwt = (user) => {
	const _id = user._id;
	const expiresIn = '1d';

	const payload = {
		id: _id,
		iat: Date.now(),
	};

	const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: expiresIn,
	});

	return {
		token: 'Bearer ' + signedToken,
		expires: expiresIn,
	};
};


function generatePassword(password) {
	const encryptedPassword = bcrypt.hashSync(password, 10);
	console.log('ePassword', encryptedPassword);
	return encryptedPassword;
}

function comparePassword(password) {
  bcrypt.compare(password, user.password);
}

module.exports.getJwtData = getJwtData;
module.exports.issueJwt = issueJwt;
module.exports.generatePassword = generatePassword;
module.exports.comparePassword = comparePassword;