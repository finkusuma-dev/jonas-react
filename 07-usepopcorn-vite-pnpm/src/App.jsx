import { useEffect } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';
import { useRef } from 'react';
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';
import { useKey } from './useKey';

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
  const [query, setQuery] = useState('');

  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query);

  const [ watched, setWatched ] = useLocalStorageState([], 'watched');

  function handleQuery(searchQuery) {
    setQuery(searchQuery);
  }
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleAddToWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    // setSelectedId(null);
  }
  function handleRemoveFromWatched(id) {
    setWatched((watched) => [
      ...watched.filter((movie) => movie.imdbID !== id),
    ]);
    //setSelectedId(null);
  }
  function handleCloseMovieDetails() {
    setSelectedId(null);
  }

  return (
    <>
      <Nav>
        <Search onChange={handleQuery} />
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
              key={selectedId}
              selectedId={selectedId}
              userRating={
                watched.find((movie) => movie.imdbID === selectedId)
                  ?.userRating ?? 0
              }
              onAddToWatched={handleAddToWatched}
              onRemoveFromWatched={handleRemoveFromWatched}
              onClose={handleCloseMovieDetails}
            />
          ) : (
            <MoviesWatched
              watched={watched}
              onSelect={handleSelectMovie}
              onRemove={handleRemoveFromWatched}
            />
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
  // query: PropTypes.string,
  onChange: PropTypes.func,
};

function Search({ onChange }) {
  const [thisQuery, setThisQuery] = useState('');
  const inputEl = useRef(null);

  useEffect(
    /// focus on input element
    function () {
      inputEl.current.focus();
    },
    [inputEl]
  );

  useKey('Enter', function(){
    if (document.activeElement === inputEl.current) 
      return;
    inputEl.current.focus();
    setThisQuery('');
    onChange('');
  });

  useEffect(
    /// call onChange on setInterval
    function () {
      if (thisQuery?.length < 3) return;

      const intervalID = setInterval(function () {
        console.log(`interval execute query: ${thisQuery}`);
        onChange(thisQuery);
      }, 1000);

      return function () {
        // console.log(`cleanup for query: ${thisQuery} `);
        clearInterval(intervalID);
      };
    },
    [thisQuery, onChange]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={thisQuery}
      onChange={(e) => setThisQuery(e.target.value)}
      //onKeyUp={handleKeyUp}
      ref={inputEl}
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
  userRating: PropTypes.number,
  onClose: PropTypes.func,
  onAddToWatched: PropTypes.func,
  onRemoveFromWatched: PropTypes.func,
};

function MovieDetails({
  selectedId,
  userRating,
  onClose,
  onAddToWatched,
  onRemoveFromWatched,
}) {
  const [movie, setMovie] = useState({});
  const [thisUserRating, setThisUserRating] = useState(userRating);
  const [isLoading, setIsLoading] = useState(false);
  const countRef = useRef(0);

  console.log('userRating', userRating);
  console.log('rating', thisUserRating);

  useKey('Escape', onClose);

  useEffect(
    /// request movie details data
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

  useEffect(
    function () {
      /// increase countRef
      if (thisUserRating) countRef.current++;
    },
    [thisUserRating]
  );

  useEffect(
    /// set document.title
    function () {
      if (!movie.Title) return;
      document.title = `Movie | ${movie.Title}`;

      return function () {
        document.title = 'UsePopcorn';
      };
    },
    [movie.Title]
  );

  function handleAdd() {
    const movieAdded = {
      imdbID: selectedId,
      Title: movie.Title,
      imdbRating: Number(movie.imdbRating),
      userRating: thisUserRating,
      runtime: Number(movie.Runtime.split(' ').at(0)),
      Poster: movie.Poster,
      countRatingDecision: countRef.current,
    };

    console.log('movieAdded', movieAdded);

    onAddToWatched(movieAdded);
  }

  function handleRemove() {
    onRemoveFromWatched(selectedId);
    // setRating(0);
  }

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
              <StarRating
                maxRating={10}
                size={24}
                defaultRating={thisUserRating}
                isReadOnly={userRating > 0}
                onSetRating={setThisUserRating}
              />

              {(() => {
                if (userRating === 0) {
                  if (thisUserRating > 0)
                    return (
                      <button className="btn-add" onClick={handleAdd}>
                        + Add to list
                      </button>
                    );
                } else {
                  return (
                    <button className="btn-add" onClick={handleRemove}>
                      - Remove from list
                    </button>
                  );
                }
              })()}
            </div>
            {/* { } */}
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>
              <strong>Actors:</strong> {movie.Actors}
            </p>
            <p>
              <strong>Directed by:</strong> {movie.Director}
            </p>
          </section>
        </>
      )}
    </div>
  );
}

MoviesWatched.propTypes = {
  watched: PropTypes.any,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
};

function MoviesWatched({ watched, onSelect, onRemove }) {
  const [isOpen, setIsOpen] = useState(true);

  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(1);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  ).toFixed(1);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(1);

  function handleRemoveMovie(e, id) {
    e.stopPropagation();
    onRemove(id);
  }

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

          <ul className="list list-movies">
            {watched.map((movie) => (
              <li key={movie.imdbID} onClick={() => onSelect(movie.imdbID)}>
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
                  <button
                    className="btn-delete"
                    onClick={(e) => handleRemoveMovie(e, movie.imdbID)}
                  >
                    X
                  </button>
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
