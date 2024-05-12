import { NavLink } from 'react-router-dom';
import styles from './AppNav.module.css';

function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li className="li">
          <NavLink to="/app/cities">Cities</NavLink>
        </li>
        <li className="li">
          <NavLink to="/app/countries">Countries</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;
