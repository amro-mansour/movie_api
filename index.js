const express = require('express'),
 morgan = require('morgan');

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));


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


app.get('/documentation.html', (req, res) => {
  res.sendFile('documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Welcome to my movies library!')
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
