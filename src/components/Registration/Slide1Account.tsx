import { ReactComponent as EyeOpen } from './../../assets/Login/eye.svg';
import { ReactComponent as EyeClose } from './../../assets/Login/crossed-eye.svg';

import { ErrorMessage, Field } from 'formik';

const Slide1Account = ({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}): React.ReactElement => {
  return (
    <div className='registration__slide'>
      <div className='registration__slide-data registration__slide-data--account'>
        <div className='registration__slide__field'>
          <label htmlFor='email' className='registration__slide__label'>
            Email
          </label>

          <Field
            id='email'
            name='email'
            type='email'
            placeholder='you@example.com'
            required
            aria-required='true'
            className='registration__slide__input'
          />
          <ErrorMessage
            name='email'
            component='p'
            className='registration__slide__error extra-light'
          />
        </div>
        <div className='registration__slide__field'>
          <label htmlFor='password' className='registration__slide__label'>
            Password
          </label>

          <div className='registration__slide__password-wrapper'>
            <Field
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              required
              aria-required='true'
              className='registration__slide__input'
            />
            <div
              className='registration__slide__password-toggle'
              onClick={() => setShowPassword((previous) => !previous)}
            >
              {showPassword ? (
                <EyeOpen className='registration__slide__password-toggle-icon' />
              ) : (
                <EyeClose className='registration__slide__password-toggle-icon' />
              )}
            </div>
          </div>
          <ErrorMessage
            name='password'
            component='p'
            className='registration__slide__error extra-light'
          />
        </div>
      </div>
    </div>
  );
};

export default Slide1Account;
