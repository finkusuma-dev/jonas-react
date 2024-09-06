export const StyleType = Object.freeze({
  headerTitle: 'headerTitle',
  header: 'header',
  listItem: 'listItem',
});

const defaultStyles = {
  headerTitle: { justifySelf: 'left' },
};

export function getCustomStyle(name, stylesProp) {
  switch (name) {
    case StyleType.headerTitle:
      return headerTitleStyle(name, stylesProp);
    // case StyleType.header:
    // return getHeader;
    default:
      return customStyleDefault(name, stylesProp);
  }
}

const customStyleDefault = (name, stylesProp) => {
  return stylesProp[name];
};

const headerTitleStyle = (name, stylesProp) => (colProp) => {
  const customStyle = customStyleDefault(name, stylesProp);

  return {
    justifySelf: colProp.align ?? defaultStyles.headerTitle.justifySelf,
    ...customStyle,
  };
};

//   return alignStyle;
// };
