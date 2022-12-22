require('dotenv').config();
import app from './test-app';
var request = require('supertest');
var mongoose = require('mongoose');


// Fetch register page
describe('GET /users/new', () => {
	it('Fetches the registration page (if one existed in a real app)', async () => {
		const res = await request(app).get('/users/new');
		
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual(
			'This endpoint would trigger a render of the register page (if routing is handled on the backend instead of React Router)'
		);
	});
});

// Registration of new user
describe('POST /users', () => {
	it('Creates a new user (with unqiue name) and saves the user in the db', async () => {
		const res = await request(app).post('/users')
			.send({
				username: 'victor',
				password: 'smith',
			})
			.set('Accept', 'application/json')
		
		expect(res.statusCode).toEqual(201);
		expect(res.text).toEqual('Registration succesful');
	});
});



// GET  /users/:username 

// POST /users/:username // updates new information about user
