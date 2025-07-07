import { useContext, useEffect, useState, type ReactElement } from 'react';
import Logo from './../../assets/Header/logo.png';
import { ReactComponent as Cart } from './../../assets/Header/cart.svg';
import { ReactComponent as ProfileIcon } from './../../assets/Header/user.svg';
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

  useEffect(() => {
    (async function checkCart(): Promise<void> {
      const token =
        localStorage.getItem('customer-token') ||
        localStorage.getItem('anonymous-token');
      if (token) {
        try {
          const result = (await checkIfCartExists()).success;

          if (result) {
            const cartResult = (await getCart()).data;
            if (cartResult) {
              setCartCounter(cartResult.totalLineItemQuantity);
            } else {
              setCartCounter(0);
            }
          } else {
            setCartCounter(0);
          }
        } catch (error) {
          void error;
        }
      }
    })();
  }, [newCounter]);

  let access = (
    <div className='header__menu__access'>
      <div
        onClick={() => navigate('/cart')}
        className='header__menu__access__cart medium'
      >
        {size <= 590 ? (
          <>Cart ({cartCounter})</>
        ) : (
          <>
            <Cart className='header__menu__access__cart__icon' />
            {cartCounter > 0 && (
              <div className='header__menu__access__cart-counter'>
                <span className='header__menu__access__cart-counter-value'>
                  {cartCounter > 1000 ? '999+' : cartCounter}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {auth?.isLogin && (
        <div className='header__menu__access__profile'>
          <a
            href=''
            className='header__menu__access__profile__link medium'
            onClick={(event) => {
              document.documentElement.classList.remove('menu-open');
              navigate('/profile');
              event.preventDefault();
            }}
          >
            {size <= 590 ? (
              <>Profile</>
            ) : (
              <ProfileIcon className='header__menu__access__profile__link_icon' />
            )}
          </a>
        </div>
      )}
      <div className='header__menu__access__separator'>|</div>
      <div className='header__menu__access__login'>
        <a
          onClick={(event) => {
            document.documentElement.classList.remove('menu-open');
            auth?.isLogin ? navigate('/') : navigate('/login');
            auth.logout();
            event.preventDefault();
          }}
          href=''
          className='header__menu__access__login__link medium'
        >
          {auth?.isLogin ? 'Log out' : 'Log in'}
        </a>
      </div>
      {!auth?.isLogin && (
        <>
          <div className='header__menu__access__separator'>/</div>
          <div className='header__menu__access__registration'>
            <a
              onClick={(event): void => {
                document.documentElement.classList.remove('menu-open');
                event.preventDefault();
                navigate('/registration');
              }}
              href=''
              className='header__menu__access__registration__link medium'
            >
              Registration
            </a>
          </div>
        </>
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
              <img src={Logo} alt='logo' />
            </div>
            <div
              onClick={() => navigate('/')}
              className='header__menu__logo__text'
            >
              <h3 className='header__menu__logo__text-title'>FloralMuse</h3>
            </div>
          </div>
          <nav className='header__menu__body'>
            <div className='header__menu__list'>
              <ul className='header__menu__list__items'>
                <li className='header__menu__list__item'>
                  <a
                    onClick={(event) => {
                      document.documentElement.classList.remove('menu-open');
                      event.preventDefault();
                      navigate('/');
                    }}
                    href=''
                    className='header__menu__list__link medium'
                  >
                    Home
                  </a>
                </li>
                <li className='header__menu__list__item'>
                  <a
                    onClick={(event) => {
                      document.documentElement.classList.remove('menu-open');
                      navigate('/catalog');
                      event.preventDefault();
                    }}
                    href=''
                    className='header__menu__list__link medium'
                  >
                    Products
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
                    className='header__menu__list__link medium'
                  >
                    About
                  </a>
                </li>
              </ul>
              {size < 590 && (
                <div className=' header__menu__access--mobile'>{access}</div>
              )}
            </div>
          </nav>
          {size > 590 && access}
          <div className='header__menu__button'>
            <button
              onClick={() =>
                document.documentElement.classList.toggle('menu-open')
              }
              type='button'
              className='header__menu__button__icon'
            >
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
