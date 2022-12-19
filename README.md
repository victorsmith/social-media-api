# social-media-api

A generic social media API. Written for my upcoming twitter clone project I'm currently working on.


#Design / Tech Stack Decisions:

Authentication: JWT (Passport-JS)
Initially, I was going to write my own JWT authentication library/package to demonstrate my understanding of the process. Unfotunatley, I had to urgently fly Houston for a work trip and ended up having a 70 hour week :(.
I opted to use PassportJS instead. Having a middleware which can handle several strategies of authentication is cool. It allows for easy integration of loggin with Google, Github etc. and is relatively painless to build on top of and it's quick and easy to throw into a project.

Database: MongoDB
Mongoose is awesome and I love using it in my Express projects. If I couldn't use it, I would use TypeORM instead with a Postgres database. Eventually, I would like to add a microservice that interacts with a SQL database. 

Testing: Jest w/ Supertest
I love Jest and I love Supertest. It's fast to implement and works well.



#What I would do differently (if this was a real production project):

1) More tests
There are only a few tests in this project. I would add more tests to cover more of the codebase. I would also add tests for the front-end (probably Jest again since it seems to work well with react).

2) More code splitting and error handling
Apologies for the excessivley long functions. SOLID principles were definitley not followed in this project. If I had more time, I would split the code into smaller functions, add stuff to controllers and services folders, and add more error handling

3) Use passport-JS w/ several auth options.
I'd add siin with Google, Github, Facebook etc. I'd also add a forgot password option.

4) I'd use TypeScript.
I opted to use JavaScript because I needed to get this project done in a limited amount of time. I would have used TypeScript if I had more time. Staticaclly typed languages are slow to write and make you feel dumb, but they are fast to read, debug and easier to maintain from my experience. 

5) I'd deploy to GCP, probably using the Kubernetes Engine.
I've been using GCP for the past few months when my current company was going through an aquisition (which ended up failing). I liked using it, and would love to deploy a Node project soon to learn more about it. I would use Kubernetes to deploy my app to a cluster of servers.  I didn't have time to do this unfortunately, but plan to do so over the christmas break.

6) Use NGINX as a reverse proxy
Would use it as a load balancer to distribute traffic to the servers. Also, to handle SSL and caching. 

7) Make a front-end for the application
Frontend will be developed over the christmas break using NextJS (it's been started already, but only the routing section is done).

8) Use Swagger to document the API

9) Use a CI/CD pipeline to deploy to GCP
I've been learning about DevOps lately, and would love to use the knowledge in a project. I would use Jenkins to build and test the project, and then deploy it to GCP using Kubernetes (as I mentioned above).

================================+==============================+===========================

API Docs:

GET    /session/new gets the webpage that has the login form
POST   /session authenticates credentials against database
DELETE /session destroys session and redirect to /

GET  /users/new gets the webpage that has the registration form
POST /users records the entered information into database as a new /user/xxx
GET  /users/xxx // gets and renders current user data in a profile view
POST /users/xxx // updates new information about user
