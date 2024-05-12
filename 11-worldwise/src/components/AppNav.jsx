import { Link } from 'react-router-dom';

function AppNav() {
  return (
    <nav>
      <ul className="li">
        <Link to="/">Link1</Link>
      </ul>
    </nav>
  );
}

export default AppNav;
