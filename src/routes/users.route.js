import { Router } from 'express';
import bcrypt from 'bcryptjs';
// User Model
import User from '../models/user.model';

const usersRouter = new Router();

// Get all users +> This request requires an internal admin API key for secuirty reasons
usersRouter.get('/', (req, res, next) => {})

// Get user with :username (username is a primary key)
usersRouter.get('/:username', (req, res, next) => {})

// No post routes => user creation is handled in the Auth router

// Edit profile of :username user
usersRouter.put('/:username', (req, res, next) => {})

// Delete user with :username
usersRouter.delete('/:username', (req, res, next) => {});

export default usersRouter;
