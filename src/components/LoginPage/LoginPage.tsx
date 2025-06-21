import { useState, useEffect, useContext, type ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { validatePassword, validateLogin } from '../../utils/validate';
import Modal from '../../utils/modal/modal';
import ClosedEye from '../../assets/closed-eye.png';
import OpenEye from '../../assets/open-eye.png';
import './login.scss';
import { AuthContext } from '../../context/AuthContext';

export const Login = (): ReactElement => {
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

  const handleCloseWindow = (): void => {
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('customer-token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className='login-container'>
      <div className='login-content'>
        <div className='login-header-container'>
          <div className='login-header-name'>Login</div>
          <button className='login-close-button' onClick={handleCloseWindow}>
            x
          </button>
        </div>
        <form className='login-form-container' onSubmit={handleLogin}>
          <div className='login-input-container'>
            <input
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
          </div>
          {emailValidError && (
            <span className='login-input-validation-span'>
              {emailValidError}
            </span>
          )}
          <div className='password-input-container'>
            <input
              className='password-input'
              type={showPassword ? 'text' : 'password'}
              required
              placeholder='password'
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordValidError(validatePassword(event.target.value));
              }}
            />
            <div
              className='password-visibility-icon-container'
              onClick={() => setShowPassword((previous) => !previous)}
            >
              <img
                className='password-visibility-icon'
                src={showPassword ? OpenEye : ClosedEye}
                alt='password visibility icon'
              ></img>
            </div>
          </div>
          {passwordValidError && (
            <span className='password-input-validation-span'>
              {passwordValidError}
            </span>
          )}
          <div className='login-button-container'>
            <button className='login-button' type='submit'>
              Login
            </button>
          </div>
          <div className='missing-account-message'>
            Don't you have an account yet?
            <span className='create-account-link'>
              <Link to={'/registration'}>Registration</Link>
            </span>
          </div>
        </form>
      </div>
      {modalActive && (
        <Modal active={modalActive} setActive={setModalActive}>
          <div className='login-error-container'>
            <div className='login-error-text'> {loginErrorMessage}</div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Login;
