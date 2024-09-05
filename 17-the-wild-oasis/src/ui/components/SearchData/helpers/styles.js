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
  const style = {
    justifySelf: colProp.align ?? defaultStyles.headerTitle.justifySelf,
  };
  if (stylesProp[StyleType.headerTitle]) {
    const customHeaderStyle = stylesProp[StyleType.headerTitle](colProp.field);
    // console.log('customHeaderStyle', customHeaderStyle, col.field);
    return { ...style, ...customHeaderStyle };
  }

  return style;
};
const getHeader = (stylesProp) => {
  if (stylesProp[StyleType.header]) {
    const customHeaderStyle = stylesProp[StyleType.header]();
    // console.log('customHeaderStyle', customHeaderStyle, col.field);
    return { ...customHeaderStyle };
  }

  return {};
};
