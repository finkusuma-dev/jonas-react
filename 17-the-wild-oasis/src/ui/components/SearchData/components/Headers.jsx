import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { getStyles, StyleType } from '../helpers/styles';

// const StyledHeaders = styled.div`
//   /* margin-top: -0.8rem; */
//   padding: 0.5rem 1.2rem;
//   position: sticky;
//   /* top: -0.8rem; */
//   z-index: 100;
//   /* left: 0;
//   right: 0; */
//   display: grid;
//   /* column-gap: 4rem; */
//   grid-template-columns: ${(props) => props.columns};
//   background-color: var(--color-grey-200);
//   color: var(--color-grey-700);
// `;

const style = {
  padding: '0.5rem 1.2rem',
  position: 'sticky',
  /* top: -0.8rem; */
  // zIndex: '100',
  /* left: 0;
  right: 0; */
  display: 'grid',
  /* column-gap: 4rem; */
  gridTemplateColumns: '1fr',
  backgroundColor: 'var(--color-grey-200)',
  color: 'var(--color-grey-700)',
};

Headers.propTypes = {
  columnsProp: PropTypes.array,
  stylesProp: PropTypes.object,
};

function Headers({ columnsProp, stylesProp }) {
  const columnsStyle = {
    gridTemplateColumns: columnsProp
      .map((item) => item.width ?? '1fr')
      .join(' '),
  };

  return (
    <header style={{ ...style, ...columnsStyle }} role="row">
      {columnsProp.map((colProp) => {
        const headerStyle = getStyles(StyleType.header)(stylesProp, colProp);
        return (
          <div key={colProp.header} style={headerStyle}>
            {colProp.header ?? ''}
          </div>
        );
      })}
    </header>
  );
}

export default Headers;
