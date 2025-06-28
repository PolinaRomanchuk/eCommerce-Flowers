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
    <Header size={size}/>
    <div className='error'>
      <div className='_container'>
        <div className='error_content'>
          <div className='error_text_container'>
            <div className='error_header'>404</div>
            <h1>The page you’re looking for is no longer available</h1>
            <button>
              <span
                onClick={(event) => {
                  navigate('/');
                  event.preventDefault();
                }}
              >
                Go back to home
              </span>
            </button>
          </div>
          <div className='error_img_container'>
            <img src={Photo} alt="flower" />
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Error;
