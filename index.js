// The following code imports the Express module to then be able to use it withi  the app
const express = require('express'),
 morgan = require('morgan'); // the morgan library is imported to be able to log any information required

// Here Express is set to a variable "app" to then use its functionalities throughout the app
const app = express();

// The following function routes any requests for static files to their corresponding file within the 'public' folder on the server
app.use(express.static('public'));
app.use(morgan('common'));

// A list of my favourite movies
let topMovies = [
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

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Welcome to my movies library!')
})

// This code would execute every time an error occurs in the code (that hasn't already been handled elsewhere)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
