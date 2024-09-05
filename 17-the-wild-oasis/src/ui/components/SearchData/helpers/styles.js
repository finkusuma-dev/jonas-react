export const StyleType = Object.freeze({
  header: 'header',
  headerRow: 'headerRow',
});

const defaultStyles = {
  header: { justifySelf: 'left' },
};

export function getStyles(name) {
  switch (name) {
    case StyleType.header:
      return getHeader;
    case StyleType.headerRow:
      return getHeaderRow;
  }
}

const getHeader = (stylesProp, colProp) => {
  const style = {
    justifySelf: colProp.align ?? defaultStyles.header.justifySelf,
  };
  if (stylesProp.header) {
    const customHeaderStyle = stylesProp.header(colProp.field);
    // console.log('customHeaderStyle', customHeaderStyle, col.field);
    return { ...style, ...customHeaderStyle };
  }

  return style;
};
const getHeaderRow = (stylesProp) => {
  if (stylesProp.header) {
    const customHeaderStyle = stylesProp.headerRow();
    // console.log('customHeaderStyle', customHeaderStyle, col.field);
    return { ...customHeaderStyle };
  }

  return {};
};
