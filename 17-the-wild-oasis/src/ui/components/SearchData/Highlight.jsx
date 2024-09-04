import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledSpan = styled.span``;

Highlight.propTypes = {
  children: PropTypes.any,
  highlightString: PropTypes.string,
  style: PropTypes.object,
};

export function Highlight({
  children,
  highlightString,
  style = {
    backgroundColor: 'blue',
    color: 'white',
  },
}) {
  const i = String(children).indexOf(highlightString);

  /// Children can be array of string, when passing more than 1 react variables as children
  /// Example: {firstName}, {LastName}
  const text = Array.isArray(children) ? children.join('') : children;

  // console.log('children', children, typeof children, children[0]);
  // console.log('highlightString', highlightString);

  if (i === -1) return <span>{children}</span>;

  const before = String(text).substring(0, i);
  const after = String(text).substring(i + highlightString.length);
  // console.log('SpanHighlight', children, before, highlightString, after);

  return (
    <span>
      {before}
      <StyledSpan style={style}>{highlightString}</StyledSpan>
      {after}
    </span>
  );
}
