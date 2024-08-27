import { useState } from 'react';
import PropTypes from 'prop-types';

import styled, { css } from 'styled-components';
import Input from './Input';

const Box = styled.div`
  position: relative;
`;

const ResultBox = styled.div`
  position: absolute;
  top: 45px;
  left: 0;
  max-width: 400px;
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 0;
  box-shadow: var(--shadow-sm);
`;

const Result = styled.div`
  cursor: pointer;
  padding: 0.5rem 1.2rem;
  ${(props) => {
    // console.log('prop', props);
    return (
      props.isActive === true &&
      css`
        background-color: var(--color-brand-500);
        color: white;
      `
    );
  }}
`;

// const fakeData = ['dog', 'cat', 'horse', 'giraffe'];

SearchInput.propTypes = {
  data: PropTypes.array,
  field: PropTypes.string, // prop to search if data.element is an object
  onSelect: PropTypes.func,
  render: PropTypes.func,
};

function SearchInput({ data, field, onSelect, render }) {
  const [search, setSearch] = useState('');
  const [results, setResult] = useState(data);
  const [showResult, setShowResult] = useState(false);
  const [resultActiveIdx, setResultActiveIdx] = useState(null);

  // console.log('results', results);
  //console.log('resultActiveIdx', resultActiveIdx);

  function handleSearch(e) {
    // console.log('handleSearch', e.target.value);
    const searchString = e.target.value;
    setSearch(searchString);

    if (searchString.length < 2) setResult([]);
    else {
      setResult(
        data.filter((el) =>
          typeof el === 'string'
            ? String(el).includes(searchString)
            : field !== undefined && el[field]
            ? String(el[field])?.includes(searchString)
            : false
        )
      );
    }
    setShowResult(true);
    setResultActiveIdx(null);
  }

  function handleKeyDown(e) {
    console.log('handleKeyDown', e.key);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!showResult) return setShowResult(true);
      setResultActiveIdx((idx) => {
        if (idx === null) return 0;
        else if (idx + 1 < results.length) {
          return idx + 1;
        }
        return idx;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!showResult) return setShowResult(true);
      setResultActiveIdx((idx) => {
        if (idx - 1 > -1) return idx - 1;
        return idx;
      });
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowResult(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setShowResult(false);
      const selectedIdx = data.findIndex((el) =>
        typeof el === 'string'
          ? el === results[resultActiveIdx]
          : field && el[field]
          ? el[field] === results[resultActiveIdx][field]
          : false
      );

      console.log('selectedIdx', selectedIdx);

      const selectedText =
        typeof data[selectedIdx] === 'string'
          ? data[selectedIdx]
          : field
          ? data[selectedIdx][field]
          : '';
      const selectedObj =
        typeof data[selectedIdx] === 'string'
          ? data[selectedIdx]
          : data[selectedIdx];
      console.log('selected', selectedText);
      setSearch(selectedText);
      if (onSelect && onSelect(selectedIdx, selectedObj)) setShowResult(false);
    }
  }

  function handleResultClick(idx) {
    setResultActiveIdx(idx);
    setShowResult(false);
    const selected = data.find((el) =>
      typeof el === 'string'
        ? el === results[idx]
        : field && el[field]
        ? el[field] === results[idx][field]
        : false
    );
    const selectedText =
      typeof selected === 'string' ? selected : field ? selected[field] : '';
    setSearch(selectedText);
    if (onSelect && onSelect(selected)) setShowResult(false);
  }

  return (
    <Box>
      <Input
        type="text"
        value={search}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        placeholder="Search for data"
      ></Input>
      {showResult && results.length > 0 && (
        <ResultBox>
          <ul>
            {results.map((result, i) => (
              <li key={i}>
                <Result
                  isActive={i == resultActiveIdx}
                  onClick={() => handleResultClick(i)}
                >
                  {typeof result === 'string'
                    ? result
                    : render !== undefined
                    ? render(result, i)
                    : ''}
                </Result>
              </li>
            ))}
          </ul>
        </ResultBox>
      )}
    </Box>
  );
}

export default SearchInput;
