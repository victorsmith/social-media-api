require('dotenv').config();
var app = require('./app');
var request = require('supertest');
var mongoose = require('mongoose');

// Use in memory mongo db instance for each testing module
require('../utils/test-db-config');
const seed = require('./seed-test-db');

// Seed the database with fake data before proceeding
beforeAll(async (done) => {
	const obj = await seed();
	done();
});

// Fetch register page
describe('GET /users/new', () => {
	it('Fetches the registration page (if one existed in a real app)', async () => {
		const res = await request(app)
			.get('/users/new');
		
		expect(res.header['content-type']).toEqual(
			expect.stringMatching(/json/)
			);
		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual(
			'This endpoint would trigger a render of the register page (if routing is handled on the backend instead of React Router)'
		);
	});
});

// Registration of new user
describe('POST /users/', () => {
	it('Creates a new user (with unqiue name) and saves the user in the db', async () => {
		const res = await request(app)
			.post('/users/')
			.send({
				username: 'victor',
				password: 'smith',
			})
			.set('Accept', 'application/json')
		expect(res.statusCode).toEqual(201);
		expect(res.header['content-type']).toEqual(
			expect.stringMatching(/json/)
		);
		expect(res.body.message).toEqual('Registration succesful');
	});
});



// GET  /users/:username 

// POST /users/:username // updates new information about user
