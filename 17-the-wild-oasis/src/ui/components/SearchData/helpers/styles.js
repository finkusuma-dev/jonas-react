export const StyleType = Object.freeze({
  headerTitle: 'headerTitle',
  header: 'header',
});

const defaultStyles = {
  headerTitle: { justifySelf: 'left' },
};

export function getStyles(name) {
  switch (name) {
    case StyleType.headerTitle:
      return getHeaderTitle;
    case StyleType.header:
      return getHeader;
  }
}

const getHeaderTitle = (stylesProp, colProp) => {
  const alignStyle = {
    justifySelf: colProp.align ?? defaultStyles.headerTitle.justifySelf,
  };
  if (stylesProp[StyleType.headerTitle]) {
    const customHeaderStyle = stylesProp[StyleType.headerTitle];
    // console.log('customHeaderStyle', customHeaderStyle, col.field);
    return { ...alignStyle, ...customHeaderStyle };
  }

  return alignStyle;
};
const getHeader = (stylesProp) => {
  if (stylesProp[StyleType.header]) {
    const customHeaderStyle = stylesProp[StyleType.header];
    // console.log('customHeaderStyle', customHeaderStyle, col.field);
    return { ...customHeaderStyle };
  }

  return {};
};
