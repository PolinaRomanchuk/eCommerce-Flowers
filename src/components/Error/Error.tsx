import { useNavigate } from 'react-router-dom';
import './error.scss';
import type { ReactElement } from 'react';
import Photo from '../../assets/Error/404.jpg';
import Header, { type HeaderProps } from '../Header/Header';
import Footer from '../Footer/Footer';

export type ErrorProps = HeaderProps & {};

export const Error = ({ size }: ErrorProps): ReactElement => {
  let navigate = useNavigate();
  return (
    <>
      <Header size={size} />
      <div className='error'>
        <div className='_container'>
          <div className='error__content'>
            <div className='error__text'>
              <div className='error__code'>404</div>
              <h1 className='error__message'>
                The page you’re looking for is no longer available
              </h1>
              <button
                className='error__button'
                onClick={(event) => {
                  navigate('/');
                  event.preventDefault();
                }}
              >
                <span className='error__button-text'>Go back to home</span>
              </button>
            </div>
            <div className='error__image'>
              <img src={Photo} alt='flower' className='error__image-pic' />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Error;
