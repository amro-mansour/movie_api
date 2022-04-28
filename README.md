# Movie API app

This application was developed as the backend part of a movies application. An API was created to allow users of the app to have access to the database of movies. Any user can create an account and then login. Once a user is logged in, he/she receives a JWT token which allows him/ her to make queries to the database. These queries will provide information about movies, movies genre, directors, etc. The users of the app can create a list of their favourite movies, where they can add and delete movies. Finally a user can also delete his/ her profile.

# This project was completed using:

- JavaScript
- Node.js
- Express
- MongoDB
- RESTful architecture
- Testing in Postman


# Dependencies

- bcrypt
- body-parser
- cors
- express
- express-validator
- jsonwebtoken
- lodash
- mongoose
- morgan
- passport
- passport-jwt
- passport-local
- uuid

# The REST API does the following:

- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
- Return data about a genre (description) by name/title (e.g., “Thriller”)
- Return data about a director (bio, birth year, death year) by name
- Allow new users to register
- Allow users to update their user info (username)
- Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
- Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
- Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
