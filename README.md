# social-media-api
A generic social media API. Written for Speer Technologies.


// Section 1 - Authentication Notes

Typically I would use a rest-ish approach for authentication by placing 
all routes related to login, registration, and password reset in auth.route.js.
Since this assignment calls for a strict RESTful API, I have instead used the structure reccomended in this stackoverflow post (https://stackoverflow.com/questions/7140074/restfully-design-login-or-register-resources)

GET    /session/new gets the webpage that has the login form
POST   /session authenticates credentials against database
DELETE /session destroys session and redirect to /

GET  /users/new gets the webpage that has the registration form
POST /users records the entered information into database as a new /user/xxx
GET  /users/xxx // gets and renders current user data in a profile view
POST /users/xxx // updates new information about user