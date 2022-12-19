import users from './users.route';
import session from './session.route';
import tweets from './tweets.route';
import auth from './auth.route';

router.use('/auth', authRouter);
router.use('/posts', postsRouter);
router.use('/users', usersRouter);

export default {
	users,
	session,
	auth,
	tweets,
};
