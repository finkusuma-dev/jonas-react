import { Link } from 'react-router-dom';
import PageNav from '../components/PageNav';

function homepage() {
  return (
    <div>
      <PageNav />
      <h1>World Wise</h1>
      
      <Link to="/product">Product</Link>
    </div>
  );
}

export default homepage;
