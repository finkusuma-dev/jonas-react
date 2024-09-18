export const StyleName = Object.freeze({
  inputText: 'inputText',
  inputTextDropDownButton: 'inputTextDropDownButton',
  inputTextDropDownButtonActive: 'inputTextDropDownButtonActive',
  inputTextClearButton: 'inputTextClearButton',
  inputTextSpinner: 'inputTextSpinner',
  header: 'header',
  headerTitle: 'headerTitle',
  list: 'list',
  item: 'item',
  itemActive: 'itemActive',
  textHighlight: 'textHighlight',
});

const defaultStyles = {
  headerTitle: { justifySelf: 'left' },
};

export function getCustomStyle(styleName, stylesProp) {
  switch (styleName) {
    case StyleName.headerTitle:
      return headerTitleStyle(styleName, stylesProp);
    default:
      return styleDefault(styleName, stylesProp);
  }
}

const styleDefault = (styleName, stylesProp) => {
  return stylesProp[styleName];
};

const headerTitleStyle = (styleName, stylesProp) => (colProp) => {
  const customStyle = styleDefault(styleName, stylesProp);

  return {
    justifySelf: colProp.align ?? defaultStyles.headerTitle.justifySelf,
    ...customStyle,
  };
};
