import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const ListBox = styled.div`
  position: absolute;
  ${(props) => {
    if (props.position?.top) {
      return css`
        top: ${props.position.top};
        max-height: ${props.position.maxHeight};
      `;
    } else if (props.position.bottom) {
      return css`
        bottom: ${props.position.bottom};
        max-height: ${props.position.maxHeight};
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
  overflow: scroll;
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
  position: sticky;
  top: -0.8rem;
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

List.propTypes = {
  asTable: PropTypes.bool,
  searchText: PropTypes.string,
  list: PropTypes.array,
  activeIdx: PropTypes.number,
  handleItemClick: PropTypes.func,
  handleItemMouseDown: PropTypes.func,
  renderItem: PropTypes.func,
  tableColumns: PropTypes.array,
  listWidth: PropTypes.number,
  listPosition: PropTypes.object,
  refListBox: PropTypes.object,
};

export default function List({
  listWidth,
  listPosition,
  asTable,
  searchText,
  list,
  activeIdx,
  handleItemClick,
  handleItemMouseDown,
  renderItem,
  tableColumns,
  refListBox,
}) {
  return (
    <ListBox ref={refListBox} width={listWidth} position={listPosition}>
      {!asTable
        ? renderList({
            searchText,
            list,
            activeIdx,
            handleItemClick,
            handleItemMouseDown,
            renderItem,
          })
        : renderTable({
            searchText,
            list,
            activeIdx,
            handleItemClick,
            handleItemMouseDown,
            renderItem,
            tableColumns,
          })}
    </ListBox>
  );
}

export function renderList({
  searchText,
  list,
  activeIdx,
  handleItemClick,
  handleItemMouseDown,
  renderItem,
}) {
  return (
    <ul>
      {list.map((item, i) => (
        <Item
          key={i}
          isActive={i == activeIdx}
          onClick={() => handleItemClick(i)}
          onMouseDown={() => handleItemMouseDown(i)}
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

export function renderTable({
  searchText,
  list,
  activeIdx,
  handleItemClick,
  handleItemMouseDown,
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
            onMouseDown={() => handleItemMouseDown(i)}
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
