export const StyleType = Object.freeze({
  header: 'header',
});

const defaultStyles = {
  header: { justifySelf: 'left' },
};

export function getStyles(name) {
  switch (name) {
    case StyleType.header:
      return getHeader;
  }
}

const getHeader = (styles, colProp) => {
  const style = {
    justifySelf: colProp.align ?? defaultStyles.header.justifySelf,
  };
  if (styles.header) {
    const customHeaderStyle = styles.header(colProp.field);
    // console.log('customHeaderStyle', customHeaderStyle, col.field);
    return { ...style, ...customHeaderStyle };
  }

  return style;
};
