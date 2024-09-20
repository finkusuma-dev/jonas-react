import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { MIN_CHARACTER_SEARCH, useSearchData } from '../SearchData';
import { ActionType } from '../hooks/useSearchDataReducer';
import { Highlight } from './Highlight';
import { getCustomStyle, StyleName } from '../helpers/styles';

const StyledItem = styled.div`
  cursor: pointer;
  padding: 0.5rem 1.2rem;
  ${(props) => {
    // console.log('prop', props);
    return (
      props.isActive === true &&
      css`
        background-color: #6366f1;
        color: white;
      `
    );
  }};
  ${(props) => {
    return (
      props.columns &&
      css`
        display: grid;
        /* column-gap: 4rem; */
        grid-template-columns: ${props.columns};
        align-items: center;
      `
    );
  }}

  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none !important;
  }
`;

Item.propTypes = {
  children: PropTypes.any,
  idx: PropTypes.number,
};

function Item({ children, idx }) {
  const { columnsProp, stylesProp, selectItem, refInput, state, dispatch } =
    useSearchData();

  const { selectedItemIdx } = state;

  /// User clicks the list
  function handleItemClick(idx) {
    selectItem(idx);
    refInput.current.focus();
  }

  function handleItemMouseDown(idx) {
    dispatch({
      type: ActionType.setSelectedItemIdx,
      payload: idx,
    });
  }

  const columnsStr = columnsProp.map((item) => item.width ?? '1fr').join(' ');

  let customStyle = getCustomStyle(StyleName.item, stylesProp);
  if (idx == selectedItemIdx) {
    customStyle = {
      ...customStyle,
      ...getCustomStyle(StyleName.itemActive, stylesProp),
    };
  }

  return (
    <StyledItem
      role="row"
      isActive={idx == selectedItemIdx || false}
      onClick={() => handleItemClick(idx)}
      onMouseDown={() => handleItemMouseDown(idx)}
      columns={columnsStr}
      style={customStyle}
    >
      {children}
    </StyledItem>
  );
}

DefaultRenderDataItem.propTypes = {
  item: PropTypes.object,
  itemIdx: PropTypes.number,
  searchText: PropTypes.string,
  columnsProp: PropTypes.array,
  searchFieldProp: PropTypes,
  stylesProp: PropTypes.array,
};
export function DefaultRenderDataItem({
  item,
  itemIdx,
  searchText,
  columnsProp,
  searchFieldProp,
  stylesProp,
}) {
  const highlightStyle = getCustomStyle(StyleName.textHighlight, stylesProp);
  if (columnsProp.length) {
    const renderedItems = columnsProp.map((column, i) => {
      // console.log('column', column, i);
      if (column.field === searchFieldProp) {
        return (
          <Highlight
            key={i}
            highlightString={
              searchText?.length >= MIN_CHARACTER_SEARCH ? searchText : ''
            }
            style={highlightStyle}
          >
            {item[column.field]}
          </Highlight>
        );
      } else if (column.type === 'image') {
        const scale = column.image?.scale || '100%';
        return (
          <div key={i} style={{ width: scale, display: 'flex' }}>
            <img src={item[column.field]} />
          </div>
        );
      } else {
        return <div key={i}>{item[column.field]}</div>;
      }
    });

    // console.log('renderedItems', renderedItems);

    return <>{renderedItems}</>;
  } else {
    return (
      <Highlight
        key={itemIdx}
        highlightString={
          searchText?.length >= MIN_CHARACTER_SEARCH ? searchText : ''
        }
        style={highlightStyle}
      >
        {item[searchFieldProp]}
      </Highlight>
    );
  }
}

export default Item;
