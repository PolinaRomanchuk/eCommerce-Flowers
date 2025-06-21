import { type ReactElement } from 'react';
import './main.scss';
import Header, { type HeaderProps } from '../Header/Header';
import Footer from '../Footer/Footer';

import Promo from '../../assets/promo.png';
import Promo2 from '../../assets/promo2.png';
import Promo3 from '../../assets/promo3.png';
import Promo4 from '../../assets/promo4.png';

export type MainPageProps = HeaderProps & {};

export const MainPage = ({ size }: MainPageProps): ReactElement => {
  return (
    <>
      <Header size={size} />
      <main className='main'>
        <div className='_container'>
          <h2 className='header-main-page'>Active promo codes</h2>
          <div className='promo-container-list'>
            <div className='promo-img-container'>
              <img src={Promo} alt='promo-summer2025'></img>
              <div className='promo-text-container'>
                <span className='promo-text'>
                  Have time to use SUMMER2025 before 31 August 2025
                </span>
              </div>
            </div>

            <div className='promo-img-container'>
              <img src={Promo2} alt='promo-fallsave'></img>
              <div className='promo-text-container'>
                <span className='promo-text'>
                  The FALLSAVE gives you a 15% discount
                </span>
              </div>
            </div>
            <div className='promo-img-container'>
              <img src={Promo4} alt='promo-sale20'></img>
              <div className='promo-text-container'>
                <span className='promo-text'>Get the best 20% discount</span>
              </div>
            </div>
            <div className='promo-img-container'>
              <img src={Promo3} alt='promo-happy'></img>
              <div className='promo-text-container'>
                <span className='promo-text'>
                  To be happy use HAPPY and get 5% discount
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MainPage;
