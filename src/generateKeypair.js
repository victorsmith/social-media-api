const crypto = require('crypto');
const fs = require('fs');

function generateKeyPair() {
	// Generates an object where the keys are stored in properties `privateKey` and `publicKey`
	const keyPair = crypto.generateKeyPairSync('rsa', {
		modulusLength: 4096, // bits - standard for RSA keys
		publicKeyEncoding: {
			type: 'pkcs1', // "Public Key Cryptography Standards 1"
			format: 'pem', // Most common formatting choice
		},
		privateKeyEncoding: {
			type: 'pkcs1', // "Public Key Cryptography Standards 1"
			format: 'pem', // Most common formatting choice
		},
	});

	// Create the public key file
	fs.writeFileSync(__dirname + '/public-key.pem', keyPair.publicKey);

	// Create the private key file
	fs.writeFileSync(__dirname + '/private-key.pem', keyPair.privateKey);
}

generateKeyPair()