// The following code imports the Express module to then be able to use it withi  the app
const express = require('express'),
 bodyParser = require('body-parser'),
 morgan = require('morgan'); // the morgan library is imported to be able to log any information required
 
 const cors = require('cors'); // Importing CORS into the app to then allow the domain specified have access to the app

 // This adds the express validator, so that it can be used to validate users input on the app to prevent a malicious entity from making requests to the app
 const { check, validationResult } = require('express-validator');

// Here Express is set to a variable "app" to then use its functionalities throughout the app
const app = express();

// require mongoose
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User

// Connection to the local database
/* mongoose.connect('mongodb://localhost:27017/myFlixDB', { 
  useNewUrlParser: true, useUnifiedTopology: true 
});  */

// Connection to the online database
mongoose.connect(process.env.CONNECTION_URI, { 
  useNewUrlParser: true, useUnifiedTopology: true 
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // This uses CORS and it allows all domain to have access to the app


// Importing the auth.js file, the (app) argument ensures that Express is available in the “auth.js” file as well
let auth = require('./auth')(app);

// Importing the passport.js file
const passport = require('passport');
require('./passport');

// The following function routes any requests for static files to their corresponding file within the 'public' folder on the server
app.use(express.static('public'));
app.use(morgan('common'));


// The following three functions use Express "app" to make requests to the server using GET, the type of data returned depends on the endpoint of the path entered in the URL
app.get('/documentation.html', (req, res) => {
  res.sendFile('documentation.html', { root: __dirname });
});

// This will return the entire list of movies as a JSON object 
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.find().then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to my movies library!')
})

// This will return a JSON object about a specific movie
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({Title: req.params.Title})
    .then((movie) =>{
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

// This will return a JSON object about a specific genre
app.get('/movies/genre/:genreName', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({'Genre.Name': req.params.genreName})
    .then((movie) => {
      if (movie) {
        res.status(201).json(movie.Genre);
      } else {
        res.status(400).send('This genre does not exist');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

// This will return a JSON object about a specific director
app.get('/movies/directors/:directorName', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({'Director.Name': req.params.directorName})
    .then((movie) => {
      if (movie) {
        res.status(201).json(movie.Director);
      } else {
        res.status(400).send('This director was not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
});

// This will allow new users to register 
app.post('/users',
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({Username: req.body.Username}) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {  //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) => {res.status(201).json(user)})
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// This allows users to update their user info
app.put('/users/:Username',
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
],
 passport.authenticate('jwt', {session: false}), (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, { 
    $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// This allows users to add a movie to their list of favorites 
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavouriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// This allows users to delete a movie from their list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $pull: { FavouriteMovies: req.params.MovieID }
  },
  { new: true},
  (err, updatedUser) =>{
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// This allows existing users to deregister
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// This code would execute every time an error occurs in the code (that hasn't already been handled elsewhere)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// App Listener 
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
