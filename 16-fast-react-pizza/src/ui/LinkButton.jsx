import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

LinkButton.propTypes = {
  children: PropTypes.any,
  to: PropTypes.string,
};

function LinkButton({ children, to }) {
  const navigate = useNavigate();

  const className =
    'text-sm text-yellow-900 hover:text-yellow-950 hover:underline';

  if (to === '-1')
    return (
      <button onClick={() => navigate(-1)} className={className}>
        &larr; Go back
      </button>
    );

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export default LinkButton;
