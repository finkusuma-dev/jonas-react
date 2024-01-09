import { useEffect } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';

const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const API_KEY = 'bda343d7';

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState('interstellar');
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovieDetails() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      async function fetchData() {
        setError('');
        setIsLoading(true);
        try {
          console.log('fetch data...');
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
          );

          if (!res.ok) {
            throw new Error('Something went wrong when fetching movies');
          }

          const data = await res.json();

          console.log('movie data', data);

          if (data.Response === 'False') {
            throw new Error('Movie not found');
          } else {
            setMovies(data.Search);
          }
        } catch (err) {
          console.error('error', err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length <= 3) return;

      fetchData();
    },
    [query]
  );

  return (
    <>
      <Nav>
        <Search query={query} onChange={(e) => setQuery(e.target.value)} />
        <NumResult movies={movies} />
      </Nav>

      <main className="main">
        <Box>
          {error !== '' ? (
            <ErrorMsg message={error} />
          ) : isLoading == true ? (
            <Loader />
          ) : (
            <MoviesFound movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>

        <Box>
          {selectedId != null ? (
            <MovieDetails
              selectedId={selectedId}
              onClose={handleCloseMovieDetails}
            />
          ) : (
            <MoviesWatched watched={watched} />
          )}
        </Box>
      </main>
    </>
  );
}

Nav.propTypes = {
  children: PropTypes.any,
};

function Nav({ children }) {
  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
      {children}
    </nav>
  );
}

Search.propTypes = {
  query: PropTypes.string,
  onChange: PropTypes.func,
};

function Search({ query, onChange }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={onChange}
    />
  );
}

NumResult.propTypes = {
  movies: PropTypes.array,
};

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

Box.propTypes = {
  children: PropTypes.any,
};

function Box({ children }) {
  return <div className="box">{children}</div>;
}

MoviesFound.propTypes = {
  movies: PropTypes.array,
  onSelectMovie: PropTypes.func,
};

function MoviesFound({ movies, onSelectMovie }) {
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <>
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? '–' : '+'}
      </button>
      {isOpen1 && (
        <ul className="list list-movies">
          {movies?.map((movie) => (
            <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
              <img src={movie.Poster} alt={`${movie.Title} poster`} />
              <h3>{movie.Title}</h3>
              <div>
                <p>
                  <span>🗓</span>
                  <span>{movie.Year}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

MovieDetails.propTypes = {
  selectedId: PropTypes.string,
  onClose: PropTypes.func,
};

function MovieDetails({ selectedId, onClose }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      async function fetchData() {
        setIsLoading(true);
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
          );
          if (!res.ok) throw new Error('Cannot fetch movie details');

          const data = await res.json();
          setMovie(data);

          console.log('movie details', data);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }

      if (selectedId !== null) fetchData();
    },
    [selectedId]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={movie.Poster} alt={`Poster of ${movie.Title} movie`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              <StarRating maxRating={10} size={24} />
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Actors: {movie.Actors}</p>
            <p>Directed by: {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

MoviesWatched.propTypes = {
  watched: PropTypes.any,
};

function MoviesWatched({ watched }) {
  const [isOpen, setIsOpen] = useState(true);

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <>
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && (
        <>
          <div className="summary">
            <h2>Movies you watched</h2>
            <div>
              <p>
                <span>#️⃣</span>
                <span>{watched.length} movies</span>
              </p>
              <p>
                <span>⭐️</span>
                <span>{avgImdbRating}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{avgUserRating}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{avgRuntime} min</span>
              </p>
            </div>
          </div>

          <ul className="list">
            {watched.map((movie) => (
              <li key={movie.imdbID}>
                <img src={movie.Poster} alt={`${movie.Title} poster`} />
                <h3>{movie.Title}</h3>
                <div>
                  <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

ErrorMsg.propTypes = {
  message: PropTypes.string,
};

function ErrorMsg({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}

function Loader() {
  return <div className="loader">Loading...</div>;
}
