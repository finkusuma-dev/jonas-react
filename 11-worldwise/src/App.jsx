import { lazy } from 'react';
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CitiesProvider } from './contexts/CitiesContext';
import { FakeAuthProvider } from './contexts/FakeAuthContext';
import SpinnerFullPage from './components/SpinnerFullPage'
import CityList from './components/CityList';
import City from './components/City';
import CountryList from './components/CountryList';
import Form from './components/Form';
import ProtectedRoute from './components/ProtectedRoute';

const Homepage = lazy(() => import('./pages/Homepage'));
const Product = lazy(() => import('./pages/Product'));
const Pricing = lazy(() => import('./pages/Pricing'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/Login'));
const AppLayout = lazy(() => import('./pages/AppLayout'));

function App() {
  return (
    <FakeAuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage/>}>
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="product" element={<Product />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />

            <Route
              path="app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
              >
              {/* Nested Routes */}
              {/* Using <Navigate replace /> to redirect and replace history with target url */}
              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
              </Suspense> 
        </BrowserRouter>
      </CitiesProvider>
    </FakeAuthProvider>
  );
}

export default App;
