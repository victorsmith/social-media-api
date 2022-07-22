auth.get('/login', (req, res) => {
	res.send('This endpoint would trigger a render of the login page');
});

auth.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: 'login',
	})
);

// Loguout ------------------------------------------------------------------
// Needs work
auth.delete('/logout', (req, res) => {
	req.logOut();
	res.redirect('login');
});

// Helper functions ------------------------------------------------------------------

// Get current user
auth.get('/current-user', (req, res) => {
	res.send(req.user);
});
