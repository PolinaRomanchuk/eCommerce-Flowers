import { useNavigate } from 'react-router-dom';
import './error.scss';
import type { ReactElement } from 'react';

export const Error = (): ReactElement => {
  let navigate = useNavigate();
  return (
    <div className='error'>
      <h1 className='error__title'>404</h1>
      <p className='error__message'>
        Oops! The page you're looking for doesn't exist.
      </p>
      <span
        onClick={(event) => {
          navigate('/');
          event.preventDefault();
        }}
        className='error__link'
      >
        Go back to homepage
      </span>
    </div>
  );
};

export default Error;
