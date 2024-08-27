import { useState } from 'react';
import PropTypes from 'prop-types';

import styled, { css } from 'styled-components';
import Input from './Input';
import { useRef } from 'react';
import { useEffect } from 'react';

const Box = styled.div`
  position: relative;
`;

const ResultBox = styled.div`
  position: absolute;
  top: 45px;
  left: 0;
  width: 500px;
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

SearchData.propTypes = {
  data: PropTypes.array.isRequired,
  searchField: PropTypes.string, // prop to search if data.element is an object
  placeholder: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  render: PropTypes.func,
  asTable: PropTypes.bool,
  maxResults: PropTypes.number,
};

function SearchData({
  data,
  searchField,
  onSelect,
  render,
  placeholder,
  asTable = false,
  maxResults = 7,
}) {
  const [search, setSearch] = useState('');
  const [results, setResult] = useState(data);
  const [isShowResult, setIsShowResult] = useState(false);
  const [resultActiveIdx, setResultActiveIdx] = useState(null);
  const refInput = useRef();
  const refResults = useRef();

  useEffect(
    /// Custom click outside, used to close the list
    /// Not using useClickOutside because we need to trigger it outside of 2 components
    function () {
      function handleClick(e) {
        // e.stopPropagation();
        // console.log('clickOutside', ref.current, e.target);
        if (
          isShowResult &&
          refInput.current &&
          refResults.current &&
          !refInput.current.contains(e.target) &&
          !refResults.current.contains(e.target)
        ) {
          // console.log('Click outside');
          setIsShowResult(false);
        }
      }

      document.addEventListener('click', handleClick, false);

      return () => document.removeEventListener('click', handleClick);
    },
    [isShowResult]
  );

  // console.log('results', results);
  //console.log('resultActiveIdx', resultActiveIdx);

  function handleSearchChange(e) {
    // console.log('handleSearch', e.target.value);
    const searchString = e.target.value;
    setSearch(searchString);

    if (searchString.length < 2) setResult([]);
    else {
      const d = data
        .filter((el) =>
          typeof el === 'string'
            ? String(el).includes(searchString)
            : searchField !== undefined && el[searchField]
            ? String(el[searchField])?.includes(searchString)
            : false
        )
        /// limit to only maxResult
        .filter((el, i) => i < maxResults);
      setResult(d);
    }
    setIsShowResult(true);
    setResultActiveIdx(null);
  }

  /// Handle keys:
  /// Arrow down, arrow up = navigate through items
  /// Enter = select item
  /// Escape = close the list
  function handleKeyDown(e) {
    // console.log('handleKeyDown', e.key);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isShowResult) return setIsShowResult(true);
      setResultActiveIdx((idx) => {
        if (idx === null) return 0;
        else if (idx + 1 < results.length) {
          return idx + 1;
        }
        return idx;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isShowResult) return setIsShowResult(true);
      setResultActiveIdx((idx) => {
        if (idx - 1 > -1) return idx - 1;
        return idx;
      });
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsShowResult(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      select(resultActiveIdx);
    }
  }

  /// User clicks the list
  function handleResultClick(idx) {
    setResultActiveIdx(idx);
    select(idx);
  }

  function select(resultIdx) {
    setIsShowResult(false);
    const dataIdx = data.findIndex((el) =>
      typeof el === 'string'
        ? el === results[resultIdx]
        : searchField && el[searchField]
        ? el[searchField] === results[resultIdx][searchField]
        : false
    );

    // console.log('selectedIdx', selectedIdx);

    const selectedText =
      typeof data[dataIdx] === 'string'
        ? data[dataIdx]
        : searchField
        ? data[dataIdx][searchField]
        : '';
    const selectedObj =
      typeof data[dataIdx] === 'string' ? data[dataIdx] : data[dataIdx];
    // console.log('selected', selectedText);
    setSearch(selectedText);
    if (onSelect) {
      onSelect(dataIdx, selectedObj);
    }
  }

  return (
    <Box>
      <Input
        type="text"
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Search for data'}
        ref={refInput}
      />
      {isShowResult && results.length > 0 && (
        <ResultBox ref={refResults}>
          {!asTable
            ? createList(results, resultActiveIdx, handleResultClick, render)
            : null}
        </ResultBox>
      )}
    </Box>
  );
}

function createList(
  results,
  resultActiveIdx,
  handleResultClick,
  renderListItem
) {
  return (
    <ul>
      {results.map((result, i) => (
        <li key={i}>
          <Result
            isActive={i == resultActiveIdx}
            onClick={() => handleResultClick(i)}
          >
            {typeof result === 'string'
              ? result
              : renderListItem !== undefined
              ? renderListItem(result, i)
              : ''}
          </Result>
        </li>
      ))}
    </ul>
  );
}

export default SearchData;
