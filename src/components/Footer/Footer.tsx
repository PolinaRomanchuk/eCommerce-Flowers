import type { ReactElement } from 'react';
import './footer.scss';

import { ReactComponent as Git } from './../../assets/Footer/github.svg';
import { ReactComponent as Mail } from './../../assets/Footer/circle-envelope.svg';
import { ReactComponent as Linkedin } from './../../assets/Footer/linkedin.svg';
import { ReactComponent as Rss } from './../../assets/Footer/rss-logo.svg';
import Logo from '../../assets/Header/logo.png';
import { useNavigate } from 'react-router-dom';
import { Pages } from '../../data/footer';

export const Footer = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <div className='footer'>
      <div className='_container'>
        <div className='footer__content'>
          <div className='footer__sections'>
            <section className='footer__section footer__contact'>
              <div className='footer_contacts_header'>
                <h3 className='footer__title'>Contact</h3>
              </div>
              <p className='footer__text extra-light'>
                Made by Polina Romanchuk. To contact me, use the following links
              </p>
              <div className='footer__icons'>
                <a
                  href='https://github.com/PolinaRomanchuk'
                  target='_blank'
                  className='rss_link'
                >
                  <Git className='footer__icons-icon' />
                </a>
                <a
                  href='mailto:polina.romanchuk99@mail.ru'
                  className='rss_link'
                >
                  <Mail className='footer__icons-icon' />
                </a>
                <a
                  href='https://www.linkedin.com/in/polina-romanchuk-2b2543286/'
                  target='_blank'
                  className='rss_link'
                >
                  <Linkedin className='footer__icons-icon' />
                </a>
              </div>
            </section>
            <section className='footer__section footer__about'>
              <div className='footer__about-header'>
                <div className='footer__logo'>
                  <img src={Logo} alt='logo' className='footer__logo-icon' />
                </div>
                <h3 className='footer__title'>FloralMuse</h3>
              </div>
              <p className='footer__text extra-light'>
                RSSchool learning project. Online flower & plant store.Built
                with HTML, CSS, TypeScript, React & CommerceTools
              </p>
              <div className='footer__icons'>
                <a
                  href='https://rs.school/'
                  target='_blank'
                  className='rss_link'
                >
                  <Rss className='footer__icons-icon' />
                </a>
              </div>
            </section>
            <section className='footer__section footer__pages'>
              <div className='footer__pages-header'>
                <h3 className='footer__title'>Pages</h3>
              </div>
              <div className='footer__pages-list'>
                {Pages.map((page) => (
                  <p
                    key={page.label}
                    className='footer__pages-page extra-light'
                    onClick={() => {
                      navigate(page.path);
                    }}
                  >
                    {page.label}
                  </p>
                ))}
              </div>
            </section>
          </div>
          <div className='footer__copyright'>
            <p className='regular'>©Learning project 2025 FloralMuse</p>{' '}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
