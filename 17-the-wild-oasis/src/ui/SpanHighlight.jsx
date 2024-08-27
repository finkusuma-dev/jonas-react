import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledSpan = styled.span``;

SpanHighlight.propTypes = {
  children: PropTypes.any,
  highlightString: PropTypes.string,
  style: PropTypes.object,
};

function SpanHighlight({
  children,
  highlightString,
  style = {
    backgroundColor: 'blue',
    color: 'white',
  },
}) {
  const i = String(children).indexOf(highlightString);

  // console.log('i', i, 'children', children, typeof children);
  console.log('highlightString', highlightString);

  if (i === -1) return <span>{children}</span>;

  const before = String(children).substring(0, i);
  const after = String(children).substring(i + highlightString.length);
  console.log('SpanHighlight', children, before, highlightString, after);

  return (
    <span>
      {/* <span> */}
      {before}
      {/* </span> */}
      <StyledSpan style={style}>{highlightString}</StyledSpan>
      {/* <span> */}
      {after}
      {/* //</span> */}
    </span>
  );
}

export default SpanHighlight;
