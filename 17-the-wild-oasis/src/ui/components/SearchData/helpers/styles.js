export const StyleType = Object.freeze({
  headerTitle: 'headerTitle',
  header: 'header',
  item: 'item',
  itemActive: 'itemActive',
});

const defaultStyles = {
  headerTitle: { justifySelf: 'left' },
};

export function getCustomStyle(name, stylesProp) {
  switch (name) {
    case StyleType.headerTitle:
      return headerTitleStyle(name, stylesProp);
    default:
      return styleDefault(name, stylesProp);
  }
}

const styleDefault = (name, stylesProp) => {
  return stylesProp[name];
};

const headerTitleStyle = (name, stylesProp) => (colProp) => {
  const customStyle = styleDefault(name, stylesProp);

  return {
    justifySelf: colProp.align ?? defaultStyles.headerTitle.justifySelf,
    ...customStyle,
  };
};
