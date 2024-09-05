export const StyleType = Object.freeze({
  headerItem: 'headerItem',
  header: 'header',
});

const defaultStyles = {
  headerItem: { justifySelf: 'left' },
};

export function getStyles(name) {
  switch (name) {
    case StyleType.headerItem:
      return getHeader;
    case StyleType.header:
      return getHeaderRow;
  }
}

const getHeader = (stylesProp, colProp) => {
  const style = {
    justifySelf: colProp.align ?? defaultStyles.headerItem.justifySelf,
  };
  if (stylesProp[StyleType.headerItem]) {
    const customHeaderStyle = stylesProp[StyleType.headerItem](colProp.field);
    // console.log('customHeaderStyle', customHeaderStyle, col.field);
    return { ...style, ...customHeaderStyle };
  }

  return style;
};
const getHeaderRow = (stylesProp) => {
  if (stylesProp[StyleType.header]) {
    const customHeaderStyle = stylesProp[StyleType.header]();
    // console.log('customHeaderStyle', customHeaderStyle, col.field);
    return { ...customHeaderStyle };
  }

  return {};
};
