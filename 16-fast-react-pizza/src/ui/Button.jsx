import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

Button.propTypes = {
  children: PropTypes.any,
  disabled: PropTypes.bool,
  to: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

const base =
  'inline-block rounded-full text-sm font-semibold uppercase tracking-wide transition-colors duration-300 focus:outline-none focus:ring focus:ring-offset-2 disabled:cursor-not-allowed ';
const basePrimary =
  base +
  ' bg-yellow-400 text-stone-800 hover:bg-yellow-300 focus:bg-yellow-300 focus:ring-yellow-300';

function Button({ children, disabled, to, onClick, type = 'primary' } = {}) {
  const styles = {
    primary: basePrimary + ' px-4 py-3 md:px-6 md:py-4',
    small: basePrimary + ' px-4 py-2 text-xs md:px-5 md:py-2.5',
    round: basePrimary + ' px-2.5 py-1 text-sm md:px-3.5 md:py-2',
    secondary:
      base +
      ' border border-2 border-stone-300 px-4 py-2.5 text-stone-400 hover:bg-stone-200 hover:text-stone-600 focus:border-opacity-0 focus:bg-stone-200 focus:text-stone-600 focus:ring-stone-200 md:px-6 md:py-3.5',
  };

  // <div className=""></div>;

  if (to)
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );

  return (
    <button disabled={disabled} className={styles[type]} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
