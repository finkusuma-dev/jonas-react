import { createContext } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const CommonRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2.4rem;
  align-items: center;
  transition: none;
`;

const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;

  ${(props) =>
    props.isActive &&
    css`
      background-color: var(--color-grey-100);
      /* border-top: 1px solid var(--color-grey-400);
      border-bottom: 1px solid var(--color-grey-400); */
    `}

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const StyledBody = styled.section`
  margin: 0.4rem 0;
`;

const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
  &:not(:has(*)) {
    display: none;
  }
`;

const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

const TableContext = createContext();

Table.propTypes = {
  children: PropTypes.any,
  columns: PropTypes.string,
};

function Table({ columns, children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role="table">{children}</StyledTable>
    </TableContext.Provider>
  );
}

Header.propTypes = {
  children: PropTypes.any,
};
function Header({ children }) {
  const { columns } = useContext(TableContext);
  return (
    <StyledHeader role="row" as="header" columns={columns}>
      {children}
    </StyledHeader>
  );
}

Row.propTypes = {
  children: PropTypes.any,
  rowId: PropTypes.any,
};
function Row({ children, rowId }) {
  const { columns } = useContext(TableContext);
  const [searchParams] = useSearchParams();
  const highlightRowId = searchParams.get('hrow');
  // console.log('hrowid', highlightRowId, rowId);

  return (
    <StyledRow
      role="row"
      columns={columns}
      isActive={rowId && highlightRowId == rowId}
    >
      {children}
    </StyledRow>
  );
}

Body.propTypes = {
  children: PropTypes.any,
  data: PropTypes.array,
  render: PropTypes.func,
};
function Body({ data, render }) {
  if (!data) return <Empty>No data to show at the moment</Empty>;

  return <StyledBody>{data.map(render)}</StyledBody>;
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;
// Table.Empty = Empty;

export default Table;
