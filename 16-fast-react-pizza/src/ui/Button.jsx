import PropTypes from 'prop-types';

Button.propTypes = {
  children: PropTypes.any,
  disabled: PropTypes.bool,
};

function Button({ children, disabled }) {
  return (
    <button
      disabled={disabled}
      className="rounded-full bg-yellow-400 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed sm:px-6 sm:py-4"
    >
      {children}
    </button>
  );
}

export default Button;
