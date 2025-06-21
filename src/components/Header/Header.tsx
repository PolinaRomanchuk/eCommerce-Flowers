import { useContext, useEffect, useState, type ReactElement } from 'react';
import Logo from './../../assets/Header/header__logo.png';
import Icon from './../../assets/favicon.png';
import { ReactComponent as Cart } from './../../assets/Header/header__cart.svg';
import { ReactComponent as ProfileIcon } from './../../assets/Header/header__user.svg';
import './Header.scss';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { checkIfCartExists, getCart } from '../../services/cart/cart';
export type HeaderProps = {
  size: number;
  newCounter?: number;
};
const Header = ({ size, newCounter }: HeaderProps): ReactElement => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartCounter, setCartCounter] = useState(0);
  let [isExistCart, setIsExistCart] = useState(false);

  useEffect(() => {
    (async function checkCart(): Promise<void> {
      const token =
        localStorage.getItem('customer-token') ||
        localStorage.getItem('anonymous-token');
      if (token) {
        try {
          setIsExistCart((await checkIfCartExists()).success);

          if (isExistCart) {
            const cartResult = (await getCart()).data;
            if (cartResult) {
              setCartCounter(cartResult.totalLineItemQuantity);
            }else{
              setCartCounter(0);
            }
          }
        } catch (error) {
          void error;
        }
      }
    })();
  }, [isExistCart, newCounter]);

  let access = (
    <div className='header__menu__access'>
      {auth?.isLogin && (
        <div className='header__menu__access__profile'>
          <a
            href=''
            className='header__menu__access__profile__link'
            onClick={(event) => {
              document.documentElement.classList.remove('menu-open');
              navigate('/profile');
              event.preventDefault();
            }}
          >
            <ProfileIcon className='profile-icon' />
          </a>
        </div>
      )}
      <div className='header__menu__access__login'>
        <a
          onClick={(event) => {
            document.documentElement.classList.remove('menu-open');
            auth?.isLogin ? navigate('/') : navigate('/login');
            auth.logout();
            event.preventDefault();
          }}
          href=''
          className='header__menu__access__login__link'
        >
          {auth?.isLogin ? 'log out' : 'log in'}
        </a>
      </div>
      {!auth?.isLogin && (
        <div className='header__menu__access__registration'>
          <a
            onClick={(event): void => {
              document.documentElement.classList.remove('menu-open');
              navigate('/registration');
              event.preventDefault();
            }}
            href=''
            className='header__menu__access__registration__link'
          >
            Registration
          </a>
        </div>
      )}
    </div>
  );
  return (
    <div className='header'>
      <div className='_container'>
        <div className='header__menu'>
          <div className='header__menu__logo'>
            <div
              onClick={() => navigate('/')}
              className='header__menu__logo__img'
            >
              <img src={Icon} alt='' />
            </div>
            <div
              onClick={() => navigate('/')}
              className='header__menu__logo__text'
            >
              <img src={Logo} alt='' />
            </div>
            <div
              onClick={() => navigate('/cart')}
              className='header__menu__logo__cart'
            >
              <Cart />
            </div>
            {cartCounter ? (
              <span className='cart-counter'>{cartCounter}</span>
            ) : (
              <></>
            )}
          </div>
          <nav className='header__menu__body'>
            <div className='header__menu__list'>
              <ul className='header__menu__list__items'>
                <li className='header__menu__list__item'>
                  <a
                    onClick={(event) => {
                      document.documentElement.classList.remove('menu-open');
                      navigate('/catalog');
                      event.preventDefault();
                    }}
                    href=''
                    className='header__menu__list__link'
                  >
                    catalog
                  </a>
                </li>
                <li className='header__menu__list__item'>
                  <a
                    onClick={(event) => {
                      document.documentElement.classList.remove('menu-open');
                      event.preventDefault();
                      navigate('/about');
                    }}
                    href=''
                    className='header__menu__list__link'
                  >
                    about
                  </a>
                </li>
              </ul>
              {size < 511 && access}
            </div>
          </nav>
          {size > 510 && access}
          <button
            onClick={() =>
              document.documentElement.classList.toggle('menu-open')
            }
            type='button'
            className='menu__icon icon-menu'
          >
            <span></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
