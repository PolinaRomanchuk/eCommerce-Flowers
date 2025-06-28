import type { ReactElement } from 'react';
import './footer.scss';

import { ReactComponent as Git } from './../../assets/Footer/github.svg';
import { ReactComponent as Mail } from './../../assets/Footer/circle-envelope.svg';
import { ReactComponent as Linkedin } from './../../assets/Footer/linkedin.svg';
import { ReactComponent as Rss } from './../../assets/Footer/rss-logo.svg';
import Logo from '../../assets/Header/logo.png';

export const Footer = (): ReactElement => {
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
                <Git className='footer-icon' />
                <Mail className='footer-icon' />
                <Linkedin className='footer-icon' />
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
                <Rss />
              </div>
            </section>
            <section className='footer_pages'>
              <div className='footer_pages_header'>
                <h3>Pages</h3>
              </div>
              <div className='pages_container'>
                <p className='extra-light'>home</p>
                <p className='extra-light'>shop</p>
                <p className='extra-light'>about</p>
                <p className='extra-light'>cart</p>
                <p className='extra-light'>user</p>
                <p className='extra-light'>registration</p>
                <p className='extra-light'>login</p>
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
