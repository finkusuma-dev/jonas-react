export const StyleType = Object.freeze({
  headerTitle: 'headerTitle',
  header: 'header',
  listItem: 'listItem',
});

const defaultStyles = {
  headerTitle: { justifySelf: 'left' },
};

export function getStyle(name, stylesProp) {
  switch (name) {
    // case StyleType.headerTitle:
    //   return getHeaderTitle;
    // case StyleType.header:
    // return getHeader;
    default:
      return getStyleDefault(name, stylesProp);
  }
}

const getStyleDefault = (name, stylesProp) => {
  return stylesProp[name];
};

// const getHeaderTitle = (stylesProp, colProp) => {
//   const alignStyle = {
//     justifySelf: colProp.align ?? defaultStyles.headerTitle.justifySelf,
//   };
//   if (stylesProp[StyleType.headerTitle]) {
//     const customHeaderStyle = stylesProp[StyleType.headerTitle];
//     // console.log('customHeaderStyle', customHeaderStyle, col.field);
//     return { ...alignStyle, ...customHeaderStyle };
//   }

//   return alignStyle;
// };
