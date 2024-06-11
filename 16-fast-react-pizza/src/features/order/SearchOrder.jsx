import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchOrder() {
  const [query, setQuery] = useState();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    navigate(`/order/${query}`);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter order #"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          className="w-28 rounded-full bg-yellow-100 px-4 py-2 text-sm transition-all placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:w-56 sm:focus:w-72"
        />
      </form>
    </div>
  );
}

export default SearchOrder;
