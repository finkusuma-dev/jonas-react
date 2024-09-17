import styled, { css } from 'styled-components';
import { useSearchData } from '../SearchData';
import { cloneElement } from 'react';
import Header from './Header';
import Item, { DefaultRenderDataItem } from './Item';
import { getCustomStyle, StyleName } from '../helpers/styles';

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
  ${(props) => {
    if (props.width)
      return css`
        width: ${props.width};
      `;
    /// Calculate width based on columns prop length
    else if (props.columns.length > 2) {
      const width = props.columns.length * 130 + 'px';
      console.log('width', width);
      return css`
        width: ${width};
      `;
    }
    /// Set width the same as inputText width
    return css`
      right: 0;
    `;
  }};
  z-index: 100;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-size: 14px;
`;

export default function List() {
  const { listWidthProp, listWindow, refListBox, stylesProp, columnsProp } =
    useSearchData();

  const customStyle = getCustomStyle(StyleName.list, stylesProp);

  return (
    <ListBox
      ref={refListBox}
      width={listWidthProp}
      window={listWindow}
      style={customStyle}
      columns={columnsProp}
    >
      <RenderList />
    </ListBox>
  );
}

// [x]: Merge RenderList & RenderTable.  Only use "columns" prop to specify the list of columns shown. Delete asTable prop.
// [x]: Make RenderDataItem prop optional. Use it to provide custom render.
// [x]: Provide custom styles for elements.
// [ ]: Apply RenderDataItem prop to custom render an item. Also provide to custom render a header.

export function RenderList() {
  const {
    RenderDataItem,
    columnsProp,
    stylesProp,
    searchFieldProp,
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
        itemEl = DefaultRenderDataItem({
          item,
          itemidx: i,
          searchText,
          columnsProp,
          searchFieldProp,
          stylesProp,
        });
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
      {columnsProp.some((column) => 'title' in column) && (
        <Header columnsProp={columnsProp} stylesProp={stylesProp} />
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
