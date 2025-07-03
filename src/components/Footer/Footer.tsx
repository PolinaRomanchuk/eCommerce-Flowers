import type { ReactElement } from 'react';
import './footer.scss';

import { ReactComponent as Git } from './../../assets/Footer/github.svg';
import { ReactComponent as Mail } from './../../assets/Footer/circle-envelope.svg';
import { ReactComponent as Linkedin } from './../../assets/Footer/linkedin.svg';
import { ReactComponent as Rss } from './../../assets/Footer/rss-logo.svg';
import Logo from '../../assets/Header/logo.png';
import { useNavigate } from 'react-router-dom';

export const Footer = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <div className='footer'>
      <div className='_container'>
        <div className='footer_content'>
          <div className='sections-container'>
            <section className='footer_contacts'>
              <div className='footer_contacts_header'>
                <h3>Contact</h3>
              </div>
              <p className='extra-light'>
                Made by Polina Romanchuk. To contact me, use the following links
              </p>
              <div className='icons-container'>
                <a
                  href='https://github.com/PolinaRomanchuk'
                  target='_blank'
                  className='rss_link'
                >
                  <Git className='footer-icon' />
                </a>
                <a
                  href='mailto:polina.romanchuk99@mail.ru'
                  className='rss_link'
                >
                  <Mail className='footer-icon' />
                </a>
                <a
                  href='https://www.linkedin.com/in/polina-romanchuk-2b2543286/'
                  target='_blank'
                  className='rss_link'
                >
                  <Linkedin className='footer-icon' />
                </a>
              </div>
            </section>
            <section className='footer_about'>
              <div className='footer_about_header'>
                <div className='footer_logo-container'>
                  <img src={Logo} alt='logo' />
                </div>
                <h3>FloralMuse</h3>
              </div>
              <p className='extra-light'>
                RSSchool learning project. Online flower & plant store.Built
                with HTML, CSS, TypeScript, React & CommerceTools
              </p>
              <div className='icons-container'>
                <a
                  href='https://rs.school/'
                  target='_blank'
                  className='rss_link'
                >
                  <Rss className='footer-icon' />
                </a>
              </div>
            </section>
            <section className='footer_pages'>
              <div className='footer_pages_header'>
                <h3>Pages</h3>
              </div>
              <div className='pages_container'>
                <p
                  className='extra-light'
                  onClick={() => {
                    navigate('/');
                  }}
                >
                  home
                </p>
                <p
                  className='extra-light'
                  onClick={() => {
                    navigate('/catalog');
                  }}
                >
                  shop
                </p>
                <p
                  className='extra-light'
                  onClick={() => {
                    navigate('/about');
                  }}
                >
                  about
                </p>
                <p
                  className='extra-light'
                  onClick={() => {
                    navigate('/cart');
                  }}
                >
                  cart
                </p>
                <p
                  className='extra-light'
                  onClick={() => {
                    navigate('/profile');
                  }}
                >
                  user
                </p>
                <p
                  className='extra-light'
                  onClick={() => {
                    navigate('/registration');
                  }}
                >
                  registration
                </p>
                <p
                  className='extra-light'
                  onClick={() => {
                    navigate('/login');
                  }}
                >
                  login
                </p>
              </div>
            </section>
          </div>
          <div className='under-text'>
            <p className='regular'>©Learning project 2025 FloralMuse</p>{' '}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
