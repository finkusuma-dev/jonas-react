import PropTypes from 'prop-types';

Content.propTypes = {
  children: PropTypes.any,
};

function Content({children}) {
  return (
    <div>
      {children}
    </div>
  )
}

export default Content
