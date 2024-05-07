import PropTypes from 'prop-types';

Content.propTypes = {
  children: PropTypes.any,
};

function Content({children}) {
  return (
    <main className='main'>
      {children}
    </main>
  )
}

export default Content
