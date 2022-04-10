// The following code imports the Express module to then be able to use it withi  the app
const express = require('express'),
 morgan = require('morgan'); // the morgan library is imported to be able to log any information required


// Here Express is set to a variable "app" to then use its functionalities throughout the app
const app = express();

// The following function routes any requests for static files to their corresponding file within the 'public' folder on the server
app.use(express.static('public'));
app.use(morgan('common'));

// A list of my favourite movies
let movies = [
  {
    title: 'Inception',
    director: 'Christopher Nolan'
  },
  {
    title: 'The Bourne Identity',
    director: 'Doug Liman'
  },
  {
    title: 'Star Wars',
    director: 'George Lucas'
  },
  {
    title: 'Ocean\'s Eleven',
    director: 'Steven Soderbergh'
  },
  {
    title: 'The Matrix',
    director: 'Lana Wachowski, Lilly Wachowski'
  },
  {
    title: 'The Wolf of Wall Street',
    director: 'Martin Scorsese'
  },
  {
    title: 'The Departed',
    director: 'Martin Scorsese'
  },
  {
    title: 'The Hangover',
    director: 'Todd Phillips'
  },
  {
    title: 'Snatch',
    director: 'Guy Ritchie'
  },
  {
    title: 'Rocky',
    director: 'John G. Avildsen'
  }
];

// the following three functions use Express "app" to make requests to the server using GET, the type of data returned depends on the endpoint of the path entered in the URL
app.get('/documentation.html', (req, res) => {
  res.sendFile('documentation.html', { root: __dirname });
});

// This will return the entire list of movies as a JSON object 
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

app.get('/', (req, res) => {
  res.send('Welcome to my movies library!')
})

// This will return a JSON object about a specific movie
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.title === title );

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('This movie is unvailable');
  }
})

// This will return a JSON object about a specific genre
app.get('/movies/genre/:genreName', (req, res) => {
  res.send('This is a JSON object containing information about a specific movie genre');
})

// This will return a JSON object about a specific genre
app.get('/movies/directors/:directorName', (req, res) => {
  res.send('This is a JSON object containing infromation about a specific director');
})

// This will allow new users to register 
app.post('/users', (req, res) => {
  res.send('The new user has been added succefully');
})

// This allows users to update their user info
app.put('/users/:id', (req, res) => {
  res.send('The following information for user x have been updated');
})

// This allows users to add a movie to their list of favorites 
app.post('/users/:id/:movieTitle', (req, res) => {
  res.send('The movie has been added to your list of favorites');
})

// This allows users to remove a movie from their list of favorites
app.delete('/users/:id/:movieTitle', (req, res) => {
  res.send('The movie has been removed from your list of favorites');
})

// This allows existing users to deregister
app.delete('/users/:id', (req, res) => {
  res.send('The user x has been removed succefully')
})

// This code would execute every time an error occurs in the code (that hasn't already been handled elsewhere)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
