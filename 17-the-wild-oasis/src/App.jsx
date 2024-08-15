import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Account from './pages/Account';
import BookingLayout from './pages/BookingLayout';
import Cabins from './pages/Cabins';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Users from './pages/Users';
import PageNotFound from './pages/PageNotFound';
import { Navigate } from 'react-router-dom';
import AppLayout from './ui/AppLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import BookingDetail from './features/bookings/BookingDetail';
import Bookings from './features/bookings/Bookings';
import Checkin from './pages/Checkin';
import ProtectedRoute from './ui/ProtectedRoute';
import DarkModeProvider from './context/DarkModeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /// staleTime: time when data is considered not fresh and should be refetched.
      ///   So when focus change to another window and then change to the app window again,
      ///   data will be refetched.
      /// 0 : it always be condered not fresh.
      staleTime: 0,
      // staleTime: 60 * 1000,
    },
  },
});

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="account" element={<Account />} />
              <Route path="bookings" element={<BookingLayout />}>
                <Route index element={<Bookings />} />
                <Route path=":bookingId" element={<BookingDetail />} />
              </Route>
              <Route path="checkin/:bookingId" element={<Checkin />} />
              <Route path="cabins" element={<Cabins />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
              <Route path="account" element={<Account />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{
            margin: '8px',
          }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: '16px',
              maxWidth: '500px',
              padding: '16px 24px',
              backgroundColor: 'var(--color-grey-0)',
              color: 'var(--color-grey-700)',
            },
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
