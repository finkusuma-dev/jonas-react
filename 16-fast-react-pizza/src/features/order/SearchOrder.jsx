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
        />
      </form>
    </div>
  );
}

export default SearchOrder;
