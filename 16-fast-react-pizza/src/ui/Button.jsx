import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

Button.propTypes = {
  children: PropTypes.any,
  disabled: PropTypes.bool,
  to: PropTypes.string,
  type: PropTypes.string,
};

const base =
  'inline-block rounded-full text-sm font-semibold uppercase tracking-wide transition-colors duration-300 focus:outline-none focus:ring focus:ring-offset-2 disabled:cursor-not-allowed ';

function Button({ children, disabled, to, type = 'primary' } = {}) {
  const styles = {
    primary:
      base +
      ' text-stone-800 bg-yellow-400 px-4 py-3 md:px-6 md:py-4 hover:bg-yellow-300 focus:bg-yellow-300 focus:ring-yellow-300',
    small:
      base +
      ' text-stone-800 bg-yellow-400 px-4 py-2 md:px-5 md:py-2.5 text-xs hover:bg-yellow-300 focus:bg-yellow-300 focus:ring-yellow-300',
    secondary:
      base +
      ' border border-stone-300 border-2 px-4 py-2.5 md:px-6 md:py-3.5 text-stone-400 hover:bg-stone-200 hover:text-stone-600  focus:text-stone-600 focus:border-opacity-0 focus:bg-stone-200 focus:ring-stone-200 ',
  };

  if (to)
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );

  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
}

export default Button;
