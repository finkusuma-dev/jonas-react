import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { useSearchData } from '../SearchData';
import { ActionType } from '../hooks/useSearchDataReducer';
import { Highlight } from './Highlight';

const StyledItem = styled.div`
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
        /* column-gap: 4rem; */
        grid-template-columns: ${props.columns};
        align-items: center;
      `
    );
  }}

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

Item.propTypes = {
  children: PropTypes.any,
  idx: PropTypes.number,
};

function Item({ children, idx }) {
  const { columnsProp, selectItem, refInput, state, dispatch } =
    useSearchData();

  const { activeIdx } = state;

  /// User clicks the list
  function handleItemClick(idx) {
    selectItem(idx);
    refInput.current.focus();
  }

  function handleItemMouseDown(idx) {
    dispatch({
      type: ActionType.setActiveIdx,
      payload: idx,
    });
  }

  const columnsStr = columnsProp.map((item) => item.width ?? '1fr').join(' ');

  return (
    <StyledItem
      role="row"
      isActive={idx == activeIdx || false}
      onClick={() => handleItemClick(idx)}
      onMouseDown={() => handleItemMouseDown(idx)}
      columns={columnsStr}
    >
      {children}
    </StyledItem>
  );
}

export function DefaultRenderDataItem(item, i, searchText) {
  const { columnsProp, searchField } = useSearchData();

  if (columnsProp.length) {
    const renderedItems = columnsProp.map((column, i) => {
      // console.log('column', column, i);
      if (column.field === searchField) {
        return (
          <Highlight
            key={i}
            highlightString={searchText}
            style={{
              backgroundColor: 'var(--color-brand-700)',
              color: 'white',
            }}
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
        key={i}
        highlightString={searchText}
        style={{
          backgroundColor: 'var(--color-brand-700)',
          color: 'white',
        }}
      >
        {item[searchField]}
      </Highlight>
    );
  }
}

export default Item;
