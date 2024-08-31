export function getSearchedTextFromItem(item, searchProp) {
  /// Searched text is item itself if it's a string,
  /// Otherwise it's defined by searchProp, searched text = item[searchProp]
  return typeof item === 'string'
    ? item
    : searchProp !== undefined && item[searchProp];
}
