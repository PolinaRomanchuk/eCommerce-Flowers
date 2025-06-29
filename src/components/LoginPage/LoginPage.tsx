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
      <div className='login-container'>
        <div className='_container'>
          <div className='login-content'>
            <div className='login-header-container'>
              <h1>Login</h1>
              <Branch />
            </div>
            <span className='separator'></span>
            <div className='form_container'>
              <form className='login-form-container' onSubmit={handleLogin}>
                <div className='login-input-container'>
                  <div className='input-name'>
                    <h3>Email</h3>
                  </div>
                  <input
                    autoComplete='off'
                    name='email'
                    className='login-input'
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
                    <p className='extra-light'>{emailValidError}</p>
                  )}
                </div>

                <div className='password-input-container'>
                  <div className='input-name'>
                    <h3>Password</h3>
                  </div>
                  <div className='pass-with-eye-container'>
                    <input
                      className='password-input'
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
                      className='password-visibility-icon-container'
                      onClick={() => setShowPassword((previous) => !previous)}
                    >
                      {showPassword ? (
                        <EyeOpen className='eye' />
                      ) : (
                        <EyeClose className='eye' />
                      )}
                    </div>
                  </div>

                  {passwordValidError && (
                    <p className='extra-light'>{passwordValidError}</p>
                  )}
                </div>
                <div className='login-button-container'>
                  <button type='submit'>
                    <span>Login</span>
                  </button>
                </div>
                <div className='missing-account-message'>
                  <p className='extra-light'>Don't you have an account yet?</p>
                  <p className='create-account-link medium'>
                    <Link to={'/registration'}>Create</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        {modalActive && (
          <Modal active={modalActive} setActive={setModalActive}>
            <div className='login-error-container'>
              <div className='login-error-text'> {loginErrorMessage}</div>
            </div>
          </Modal>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Login;
