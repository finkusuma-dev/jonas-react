import { useState, useEffect } from "react";

const API_KEY = 'bda343d7';

export function useMovies(query){
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(
    /// fetch movie data from search query & setMovies.
    
    function () {

      const controller = new AbortController();

      async function fetchData() {
        setError('');
        setIsLoading(true);
        try {
          console.log('fetch data...');
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
            { signal: controller.signal }
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
          console.error('error', err.name);
          if (err.name !== 'AbortError') setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) return;
      
      // FIXME: Cannot add callback function (to close movie details). 
      // If it is added as function parameter and then also added as useEffect's dependencies, 
      // there will be infinite fetch request.
      // handleCloseMovieDetails();
      fetchData();

      return async function () {
        controller.abort();
        console.log(`cleanup for query ${query}`);
      };
    },
    [query]
  );

  return {movies, isLoading, error}
}