import { useContext, useEffect, useState, type ReactElement } from 'react';
import MainPage from '../MainPage/MainPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Error from '../Error/Error';
import Cart from '../Cart/Cart';
import { UserProfilePage } from '../User/UserProfile';
import About from '../About/About';
import Catalog from '../Catalog/Catalog';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import Login from '../LoginPage/LoginPage';
import { Registration } from '../Registration/Registration';
import Product from '../Product/Product';

export const App = (): ReactElement => {
  let [size, setSize] = useState(document.documentElement.clientWidth);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const token =
      localStorage.getItem('customer-token') ||
      localStorage.getItem('anonymous-token');
    if (!token && !auth.isLogin) {
      auth.anonymousAccess();
    }
  }, [auth, auth.isLogin]);

  useEffect((): void | (() => void) => {
    function handle(): void {
      setSize(document.documentElement.clientWidth);
    }
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('resize', handle);
    };
  }, []);

  return (
    <div className='wrapper'>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/registration' element={<Registration />} />
            <Route path='/cart' element={<Cart size={size} />} />
            <Route path='/profile' element={<UserProfilePage size={size} />} />
            <Route path='/about' element={<About size={size} />} />
            <Route path='/catalog' element={<Catalog size={size} />} />
            <Route path='/product/:id' element={<Product size={size} />} />
            <Route path='/' element={<MainPage size={size} />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
