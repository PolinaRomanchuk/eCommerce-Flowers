import { useState, useEffect, useContext, type ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { validatePassword, validateLogin } from '../../utils/validate';
import Modal from '../../utils/modal/modal';
import './login.scss';
import { AuthContext } from '../../context/AuthContext';
import Header, { type HeaderProps } from '../Header/Header';
import Footer from '../Footer/Footer';
import { ReactComponent as Branch } from './../../assets/Main/branch.svg';
import { ReactComponent as EyeOpen } from './../../assets/Login/eye.svg';
import { ReactComponent as EyeClose } from './../../assets/Login/crossed-eye.svg';

export type LoginProps = HeaderProps & {};

export const Login = ({ size }: LoginProps): ReactElement => {
  const [email, setEmail] = useState('');
  const [emailValidError, setEmailValidError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordValidError, setPasswordValidError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [modalActive, setModalActive] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogin = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (emailValidError !== '' || passwordValidError !== '') {
      return;
    }
    auth?.login(
      email,
      password,
      (errorMessage) => {
        setLoginErrorMessage(errorMessage);
        setModalActive(true);
      },
      () => {
        navigate('/');
      },
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('customer-token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <Header size={size} />
      <div className='login'>
        <div className='_container'>
          <div className='login__content'>
            <div className='login__header'>
              <h1 className='login__title'>Login</h1>
              <Branch className='login__branch-icon' />
            </div>
            <span className='login__separator'></span>
            <div className='login__form-container'>
              <form className='login__form' onSubmit={handleLogin}>
                <div className='login__field'>
                  <label className='login__label' htmlFor='email'>
                    Email
                  </label>

                  <input
                    id='email'
                    autoComplete='off'
                    className='login__input'
                    type='text'
                    required
                    placeholder='user@example.com'
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailValidError(validateLogin(event.target.value));
                    }}
                  />
                  {emailValidError && (
                    <p className='login__valid-error extra-light'>
                      {emailValidError}
                    </p>
                  )}
                </div>

                <div className='login__field'>
                  <label className='login__label' htmlFor='password'>
                    Password
                  </label>

                  <div className='login__password-wrapper'>
                    <input
                      id='password'
                      className='login__input login__input--password'
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder='password'
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setPasswordValidError(
                          validatePassword(event.target.value),
                        );
                      }}
                    />
                    <div
                      className='login__password-toggle'
                      onClick={() => setShowPassword((previous) => !previous)}
                    >
                      {showPassword ? (
                        <EyeOpen className='login__password-toggle-icon'  />
                      ) : (
                        <EyeClose className='login__password-toggle-icon' />
                      )}
                    </div>
                  </div>

                  {passwordValidError && (
                    <p className='login__valid-error extra-light'>
                      {passwordValidError}
                    </p>
                  )}
                </div>
                <div className='login__button-container'>
                  <button type='submit' className='login__button'>
                    <span>Login</span>
                  </button>
                </div>
                <div className='login__register'>
                  <p className='extra-light'>Don't you have an account yet?</p>
                  <Link
                    to='/registration'
                    className='login__register-link medium'
                  >
                    Create
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {modalActive && (
          <Modal active={modalActive} setActive={setModalActive}>
            <div className='login__modal'>
              <div className='login__modal-text'> {loginErrorMessage}</div>
            </div>
          </Modal>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Login;
