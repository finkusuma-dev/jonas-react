import { useState } from 'react';
import PropTypes from 'prop-types';

import styled, { css } from 'styled-components';
import Input from './Input';
import { useRef } from 'react';
import { useEffect } from 'react';

const Box = styled.div`
  position: relative;
`;

const ListBox = styled.div`
  position: absolute;
  top: 45px;
  left: 0;
  width: ${(props) => props.width || 'auto'};
  z-index: 100;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  font-size: 1.4rem;
  //
  position: absolute;
  border: 1px solid var(--color-grey-300);
  padding: 0.8rem 0;
`;

const TableHeaders = styled.div`
  margin-top: -0.8rem;
  padding: 0.5rem 1.2rem;
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  background-color: var(--color-grey-300);
  color: black;
`;

const Item = styled.div`
  cursor: pointer;
  padding: 0.5rem 1.2rem;
  ${(props) => {
    // console.log('prop', props);
    return (
      props.isActive === true &&
      css`
        background-color: var(--color-brand-500);
        color: var(--color-grey-0);
      `
    );
  }};
  ${(props) => {
    return (
      props.columns &&
      css`
        display: grid;
        grid-template-columns: ${props.columns};
        align-items: center;
      `
    );
  }}

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

// const fakeData = ['dog', 'cat', 'horse', 'giraffe'];

SearchData.propTypes = {
  data: PropTypes.array.isRequired,
  searchProp: PropTypes.string, // prop to search if data.element is an object
  placeholder: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  renderItem: PropTypes.func,
  maxResults: PropTypes.number,
  listWidth: PropTypes.number,
  asTable: PropTypes.bool,
  tableColumns: PropTypes.array,
  autoComplete: PropTypes.bool,
};

function SearchData({
  data,
  searchProp,
  onSelect,
  renderItem,
  placeholder,
  maxResults = 7,
  listWidth,
  asTable = false,
  tableColumns = [],
  autoComplete = false,
}) {
  const [searchText, setSearchText] = useState('');
  const [inputText, setInputText] = useState('');
  const [list, setList] = useState(data);
  const [isShowList, setIsShowList] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);
  const [isApplyAutoComplete, setIsApplyAutoComplete] = useState(false);

  /// Ref to use with Custom click outside
  const refInput = useRef();
  const refResults = useRef();

  useEffect(
    /// Custom click outside, used to close the list
    /// Not using useClickOutside because needs to trigger it outside of 2 components
    function () {
      function handleClick(e) {
        // e.stopPropagation();
        // console.log('clickOutside', ref.current, e.target);
        if (
          isShowList &&
          refInput.current &&
          refResults.current &&
          !refInput.current.contains(e.target) &&
          !refResults.current.contains(e.target)
        ) {
          // console.log('Click outside');
          setIsShowList(false);
        }
      }

      document.addEventListener('click', handleClick, false);

      return () => document.removeEventListener('click', handleClick);
    },
    [isShowList]
  );

  /// AUTO COMPLETE part, step 3:
  /// Mark selection for autocomplete
  useEffect(() => {
    if (
      autoComplete &&
      isApplyAutoComplete &&
      inputText.indexOf(searchText) === 0
    ) {
      // console.log('setSelectionRange', searchText.length, inputText.length);
      refInput.current.setSelectionRange(searchText.length, inputText.length);
    }
  }, [autoComplete, isApplyAutoComplete, searchText, inputText]);

  // console.log('results', results);
  //console.log('resultActiveIdx', resultActiveIdx);

  function handleSearchChange(e) {
    // console.log('handleSearch', e.target.value);
    const searchString = e.target.value;
    setInputText(searchString); // inputText changes on handleSearchChange and on select result item.
    setSearchText(searchString); // searchText only changes on handleSearchChange.

    if (searchString.length < 2) setList([]);
    else {
      const alist = data
        /// Filter items based on the search string
        .filter((el) =>
          typeof el === 'string'
            ? String(el).includes(searchString)
            : searchProp !== undefined && el[searchProp]
            ? String(el[searchProp]).includes(searchString)
            : false
        )
        /// Sort items based on the index where the search string is found
        .sort((a, b) => {
          const aString = getSearchedTextFromItem(a);
          const bString = getSearchedTextFromItem(b);
          const aIdx = aString.indexOf(searchString);
          const bIdx = bString.indexOf(searchString);

          if (aIdx !== bIdx) {
            /// If idx are not the same, simply substract the idx.
            /// Ex: [li]ght !== f[li]ght.
            /// 'light' should appear before 'flight'.
            return aIdx - bIdx;
          } else {
            /// If idx are the same, compare the remaining word
            /// Ex: [li]ght === [li]brary. Compare 'ght' with 'brary'
            /// In this case 'library' should appear before 'light'
            ///
            const restAString = String(aString).substring(
              aString.indexOf(searchString) + searchString.length
            );
            const restbString = String(bString).substring(
              bString.indexOf(searchString) + searchString.length
            );
            const res =
              restAString < restbString
                ? -1
                : restAString > restbString
                ? 1
                : 0;
            // console.log('rest a:b', restAString, restbString, res);
            return res;
          }
        })
        /// Limit the number of items to only less or equal than maxResult
        .filter((el, i) => i < maxResults);

      /// AUTO COMPLETE part, step 2:
      /// Set input text for autocomplete
      if (autoComplete) {
        if (isApplyAutoComplete && alist.length > 0) {
          const str = getSearchedTextFromItem(alist[0]);

          if (str.indexOf(searchString) === 0) {
            setInputText(str);
          }
        }
      }

      setList(alist);
    }

    setIsShowList(true);
    setActiveIdx(null);
  }

  /// Handle keys:
  /// Arrow down, arrow up = navigate through items
  /// Enter = select item
  /// Escape = close the list
  function handleKeyDown(e) {
    console.log('handleKeyDown', e.key, e.keyCode);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isShowList) return setIsShowList(true);
      setActiveIdx((i) => {
        if (i === null) return 0;
        else if (i + 1 < list.length) {
          return i + 1;
        }
        return i;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isShowList) return setIsShowList(true);

      setActiveIdx((i) => {
        if (i - 1 > -1) return i - 1;
        return i;
      });
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsShowList(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx) {
        selectItem(activeIdx);
      } else if (
        list.length > 0 &&
        getSearchedTextFromItem(list[0]).indexOf(searchText) === 0
      ) {
        selectItem(0);
      }
    } else if (e.key === 'Tab') {
      setIsShowList(false);
    }
    // console.log('setIsAutoComplete', e.keyCode);

    /// AUTO COMPLETE part, step 1: determine isAutoComplete on keyDown event
    /// Prevent autocomplete for keycode <= 47.
    if (autoComplete) {
      // console.log(
      //   'e.target.selectionStart',
      //   e.target.selectionStart,
      //   searchText.length
      // );

      /// Only autocomplete when cursor is on the end of searchText
      if (e.target.selectionStart !== searchText.length) {
        return setIsApplyAutoComplete(false);
      }
      const selectedText = e.target.value.substring(
        e.target.selectionStart,
        e.target.selectionEnd
      );

      const firstItem = list.length > 0 ? getSearchedTextFromItem(list[0]) : '';
      // console.log(
      //   ' > ',
      //   searchText,
      //   ' + ',
      //   selectedText,
      //   ' === ',
      //   firstItem,
      //   searchText + selectedText === firstItem
      // );
      /// if current selected text is from autocomplete, set the next autocomplete
      if (
        selectedText.length === 0 ||
        searchText + selectedText === firstItem
      ) {
        setIsApplyAutoComplete(e.keyCode > 47);
      }
    }

    // console.log(
    //   'get selection range',
    //   e.target.value.substring(e.target.selectionStart, e.target.selectionEnd),
    //   'searchText',
    //   searchText
    // );
  }

  /// User clicks the list
  function handleItemClick(idx) {
    setActiveIdx(idx);
    selectItem(idx);
  }

  function handleBlur() {
    /// NOTE: Closing the list onBlur create an issue: Cannot click the list item to select it.
    // console.log('handleBlur', e);
    // setIsShowList(false);
  }

  function selectItem(itemIdx) {
    setIsShowList(false);
    const dataIdx = data.findIndex((obj) =>
      typeof obj === 'string'
        ? obj === list[itemIdx]
        : searchProp !== undefined && obj[searchProp]
        ? obj[searchProp] === list[itemIdx][searchProp]
        : false
    );

    // console.log('selectedIdx', selectedIdx);

    const selectedText =
      typeof data[dataIdx] === 'string'
        ? data[dataIdx]
        : searchProp !== undefined
        ? data[dataIdx][searchProp]
        : '';
    const selectedObj = data[dataIdx];

    setInputText(selectedText);
    refInput.current.setSelectionRange(
      selectedText.length,
      selectedText.length
    );

    if (onSelect) {
      onSelect(dataIdx, selectedObj);
    }
  }

  function getSearchedTextFromItem(item) {
    /// Data search text is item itself if it's a string,
    /// Otherwise it's defined by searchProp, data searchText = item[searchProp]
    return typeof item === 'string'
      ? item
      : searchProp !== undefined && item[searchProp];
  }

  return (
    <Box>
      <Input
        type="text"
        value={inputText}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder || 'Search for data'}
        ref={refInput}
      />
      {isShowList && list.length > 0 && (
        <ListBox ref={refResults} width={listWidth}>
          {!asTable
            ? renderList({
                searchText,
                list,
                activeIdx,
                handleItemClick,
                renderItem,
              })
            : renderTable({
                searchText,
                list,
                activeIdx,
                handleItemClick,
                renderItem,
                tableColumns,
              })}
        </ListBox>
      )}
    </Box>
  );
}

function renderList({
  searchText,
  list,
  activeIdx,
  handleItemClick,
  renderItem,
}) {
  return (
    <ul>
      {list.map((item, i) => (
        <Item
          key={i}
          isActive={i == activeIdx}
          onClick={() => handleItemClick(i)}
        >
          {typeof item === 'string'
            ? item
            : renderItem !== undefined
            ? renderItem(item, i, searchText)
            : ''}
        </Item>
      ))}
    </ul>
  );
}
function renderTable({
  searchText,
  list,
  activeIdx,
  handleItemClick,
  renderItem,
  tableColumns,
}) {
  const columns = tableColumns.map((item) => item.width ?? '1fr').join(' ');
  return (
    <>
      {tableColumns.some((item) => 'header' in item) && (
        <TableHeaders columns={columns} role="row" as="header">
          {tableColumns.map((item) => (
            <div
              key={item.header}
              style={{ justifySelf: item.align ?? 'left' }}
            >
              {item.header ?? ''}
            </div>
          ))}
        </TableHeaders>
      )}
      <div>
        {list.map((item, i) => (
          <Item
            key={i}
            role="row"
            isActive={i == activeIdx}
            onClick={() => handleItemClick(i)}
            columns={columns}
          >
            {typeof item === 'string'
              ? item
              : renderItem !== undefined
              ? renderItem(item, i, searchText)
              : ''}
          </Item>
        ))}
      </div>
    </>
  );
}

export default SearchData;
