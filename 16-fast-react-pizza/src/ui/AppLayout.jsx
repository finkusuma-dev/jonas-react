import Header from './Header';
import CartOverview from '../features/cart/CartOverview';
import { Outlet } from 'react-router-dom';
import { useNavigation } from 'react-router-dom';
import LoadingIndicator from './LoadingIndicator';

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="layout">
      {isLoading && <LoadingIndicator />}
      <Header />
      <main>
        <Outlet />
      </main>
      <CartOverview />
    </div>
  );
}

export default AppLayout;
