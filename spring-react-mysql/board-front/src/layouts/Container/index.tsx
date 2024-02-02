import Footer from 'layouts/Footer';
import Header from 'layouts/Header';
import { Outlet, useLocation } from 'react-router-dom';

export default function Container() {
  const { pathname } = useLocation();

  return (
    <>
      <Header />
      <Outlet />
      {pathname !== '/auth' && <Footer />}
    </>
  );
}