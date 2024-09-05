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

const headerStyle = {
  padding: '0.5rem 1.2rem',

  display: 'grid',

  gridTemplateColumns: '1fr',
  backgroundColor: 'hsl(0, 0%, 85.09803921568627%)',
  color: 'black',
};

Header.propTypes = {
  columnsProp: PropTypes.array,
  stylesProp: PropTypes.object,
};

function Header({ columnsProp, stylesProp }) {
  /// customStyle is get from styles.header
  const customStyle = getStyles(StyleType.header)(stylesProp);
  const style = {
    ...headerStyle,
    /// columnsStyle is get from columnsProp.width
    gridTemplateColumns: columnsProp
      .map((item) => item.width ?? '1fr')
      .join(' '),
    ...customStyle,
  };
  return (
    <header style={style} role="row">
      {columnsProp.map((colProp) => {
        const headerItemStyle = getStyles(StyleType.headerItem)(
          stylesProp,
          colProp
        );
        return (
          <div key={colProp.header} style={headerItemStyle}>
            {colProp.header ?? ''}
          </div>
        );
      })}
    </header>
  );
}

export default Header;
