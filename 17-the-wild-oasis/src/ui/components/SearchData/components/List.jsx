import styled, { css } from 'styled-components';
import { useSearchData } from '../SearchData';
import { cloneElement } from 'react';
import Header from './Header';
import Item, { DefaultRenderDataItem } from './Item';

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

export default function List() {
  const { listWidth, listWindow, refListBox } = useSearchData();

  return (
    <ListBox ref={refListBox} width={listWidth} window={listWindow}>
      <RenderList />
    </ListBox>
  );
}

// [x]: Merge RenderList & RenderTable.  Only use "columns" prop to specify the list of columns shown. Delete asTable prop.
// [x]: Make RenderDataItem prop optional. Use it to provide custom render.
// [ ]: Apply RenderDataItem prop to custom render an item. Also provide to custom render a header.
// [ ]: Provide custom styles for elements.

export function RenderList() {
  const {
    RenderDataItem,
    columnsProp,
    stylesProp,

    ///
    state,
    // dispatch,
    //
    // selectItem,
    // refInput,
    refListItemsContainer,
  } = useSearchData();

  const { searchText, list } = state;

  /// Calls RenderDataItem if present
  const itemReactEl = list.map((item, i) => {
    let itemEl = item;

    if (typeof item !== 'string') {
      if (RenderDataItem !== undefined) {
        itemEl = RenderDataItem(item, i, searchText);
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
        <Headers columnsProp={columnsProp} stylesProp={stylesProp} />
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
          <Item key={i} idx={i}>
            {itemReactEl[i]}
          </Item>
        ))}
      </div>
    </>
  );
}
