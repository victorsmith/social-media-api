require('dotenv').config();
var app = require('./test-app');
var request = require('supertest');
// var mongoose = require('mongoose');

// Use in memory mongo db instance for each testing module
// require('../utils/test-db-config');
// const seedDB = require('./seed-test-db');

describe('GET /session/new', () => {
	it('Fetches the login page (if one existed in a real app)', async () => {
		const res = await request(app).get('/session/new');

		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual(
			'This endpoint would trigger a render of the login page'
		);
	});
});

// Login
describe('POST /users/', () => {
	it('Logs into user created in "seed-test-db. On success, redirects to home page. \
  Now, req.user should be equal to username "John Doe"', 
  async () => {
		const res = await request(app)
			.post('/session/')
			.send({
				username: 'John Doe',
				password: 'password',
			})
			.set('Accept', 'application/json');

		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual('Home Page');
		expect(res.body.user).toEqual('John Doe');
	});
});
