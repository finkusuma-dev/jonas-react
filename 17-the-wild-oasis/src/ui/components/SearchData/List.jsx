import styled, { css } from 'styled-components';
import { useSearchData } from './SearchData';
import { cloneElement } from 'react';
import { ActionType } from './useSearchDataReducer';
import { Highlight } from './Highlight';

const ListBox = styled.div`
  position: absolute;
  ${(props) => {
    if (props.window?.top) {
      return css`
        top: ${props.window.top};
        max-height: ${props.window.maxHeight};
      `;
    } else if (props.window?.bottom) {
      return css`
        bottom: ${props.window.bottom};
        max-height: ${props.window.maxHeight};
      `;
    }
    return css`
      top: 45px;
      max-height: 260px;
    `;
  }};

  left: 0;
  width: ${(props) => props.width || 'auto'};
  /* max-height: ${(props) => props.maxHeight || '260px'}; */
  /* overflow: scroll; */
  /* scroll-behavior: smooth; */
  z-index: 100;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  font-size: 1.4rem;
  //
  position: absolute;
  border: 1px solid var(--color-grey-300);
  /* padding: 0.8rem 0; */
`;

const TableHeaders = styled.div`
  /* margin-top: -0.8rem; */
  padding: 0.5rem 1.2rem;
  position: sticky;
  /* top: -0.8rem; */
  z-index: 100;
  /* left: 0;
  right: 0; */
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  background-color: var(--color-grey-200);
  color: var(--color-grey-700);
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

export default function List() {
  const { listWidth, listWindow, refListBox } = useSearchData();

  return (
    <ListBox ref={refListBox} width={listWidth} window={listWindow}>
      <RenderList />
    </ListBox>
  );
}

// [x]: Merge RenderList & RenderTable.  Only use "columns" prop to specify the list of columns shown. Delete asTable prop.
// [x]: Make renderDataItem prop optional. Use it to provide custom render.
// [ ]: Apply renderDataItem prop to custom render an item. Also provide to custom render a header.
// [ ]: Provide custom styles for elements.

export function RenderList() {
  const {
    renderDataItem,
    columnsProp,

    ///
    state,
    dispatch,
    //
    selectItem,
    refInput,
    refListItemsContainer,
  } = useSearchData();

  const { searchText, list, activeIdx } = state;

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

  /// Calls renderDataItem if present
  const itemReactEl = list.map((item, i) => {
    let itemEl = item;

    if (typeof item !== 'string') {
      if (renderDataItem !== undefined) {
        itemEl = renderDataItem(item, i, searchText);
      } else {
        itemEl = DefaultRenderDataItem(item, i, searchText);
      }
    }

    /// Align data items based on the columnsProp.align property
    ///
    if (columnsProp.length > 0) {
      itemEl = itemEl.props?.children.map((el, colIdx) => {
        if (columnsProp[colIdx].align && columnsProp[colIdx].align !== 'left') {
          if (el.props.style) {
            /// add prop to the style
            el.props.style.justifySelf = columnsProp[colIdx].align ?? 'left';
          }
          /// add new style prop
          else {
            el = cloneElement(el, {
              style: { justifySelf: columnsProp[colIdx].align ?? 'left' },
            });
          }
          el = cloneElement(el, {
            key: colIdx,
          });
        }
        // console.log(`${colIdx}`, el.props.style);
        return el;
      });
    }

    return itemEl;
  });

  return (
    <>
      {columnsProp.some((item) => 'header' in item) && (
        <TableHeaders columns={columnsStr} role="row" as="header">
          {columnsProp.map((col) => (
            <div key={col.header} style={{ justifySelf: col.align ?? 'left' }}>
              {col.header ?? ''}
            </div>
          ))}
        </TableHeaders>
      )}
      <div
        ref={refListItemsContainer}
        style={{
          overflow: 'scroll',
          border: '0px solid red',
          padding: '0.8rem 0',
        }}
      >
        {list.map((_, i) => (
          <Item
            key={i}
            role="row"
            isActive={i == activeIdx || false}
            onClick={() => handleItemClick(i)}
            onMouseDown={() => handleItemMouseDown(i)}
            columns={columnsStr}
          >
            {itemReactEl[i]}
          </Item>
        ))}
      </div>
    </>
  );
}

function DefaultRenderDataItem(item, i, searchText) {
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
        return (
          <div key={i}>
            <img src={item[column.field]} width="20px" />
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
