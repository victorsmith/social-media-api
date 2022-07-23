require('dotenv').config();
import app from './test-app';
var request = require('supertest');
var mongoose = require('mongoose');

const targetID = '62dbc86a98cd4531477b1ba6';

describe('GET /tweets', () => {
	it('Fetches the 15 of the most recent tweets from all users', async () => {
		const res = await request(app).get('/tweets');
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual('Tweets fetched');
	});
});

describe('GET /tweets/:id', () => {
	it('Gets tweet with specific ID', async () => {
		const res = await request(app).get('/tweets/:id');

		console.log(res.body);

		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual('Tweets fetched');
		expect(res.body).toEqual(expect.any(Object));
	});
});

describe('POST /tweets', () => {
	it('Posts a new tweet', async () => {
		const res = await request(app)
			.post('/tweets')
			.send({
				content: 'This is a test tweet',
			})
			.set('Accept', 'application/json');

		console.log(res.body);

		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual('Tweets posted');
	});
});

describe('PUT /tweets/:id', () => {
	it('Edits existing tweet with :id. Changes content from "not edited tweet" => "edited tweet" ', async () => {

		const res = await request(app)
			.put(`/tweets/${targetID}`)
			.send({
				content: 'edited tweet',
			})
			.set('Accept', 'application/json');

		console.log(res.body);

		expect(res.statusCode).toEqual(201);
		expect(res.text).toEqual('Tweets updated');
	});
});

describe('DELETE /tweets/:id', () => {
	it('Deletes tweet with :id', async () => {
		const target = '62dbc86a98cd4531477b1ba6';

		const res = await request(app)
			.delete(`/tweets/${targetID}`)

		console.log(res.body);

		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual('Tweet deleted');
	});
});
