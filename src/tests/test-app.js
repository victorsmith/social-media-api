// App with a fake in-memory db
require('dotenv').config();
const express = require('express');
const testapp = express();

require('../utils/test-db-config');

const indexRouter = require('../routes/index');

testapp.use(express.urlencoded({ extended: false }));
testapp.use(express.json());
testapp.use('/', indexRouter);

module.exports = testapp;
 