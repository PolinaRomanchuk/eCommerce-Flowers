import { type ReactElement } from 'react';
import './main.scss';
import Header, { type HeaderProps } from '../Header/Header';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Branch } from './../../assets/Main/branch.svg';
import { ReactComponent as BlackBranch } from './../../assets/Main/branch2.svg';
import { ReactComponent as WhiteBranch } from './../../assets/Main/branch3.svg';
import { ReactComponent as BrownBranch } from './../../assets/Main/branch6.svg';
import Plant from '../../assets/Main/plant 1.png';
import Pionies from '../../assets/Main/pion.jpg';

import flowerImg from '../../assets/Main/flower.png';
const flowers = Array(5).fill({ name: 'Spring flower', image: flowerImg });

export type MainPageProps = HeaderProps & {};
type ProductCardProps = {
  price: string;
  image: string;
};

export const MainPage = ({ size }: MainPageProps): ReactElement => {
  const navigate = useNavigate();

  const products = [
    { id: 1, price: '$180.15', image: Plant },
    { id: 2, price: '$180.10', image: Plant },
    { id: 3, price: '$180.15', image: Plant },
    { id: 4, price: '$90.00', image: Plant },
    { id: 5, price: '$180.15', image: Plant },
    { id: 6, price: '$180.15', image: Plant },
    { id: 7, price: '$180.10', image: Plant },
    { id: 8, price: '$180.15', image: Plant },
  ];

  function ProductCard({ price, image }: ProductCardProps): ReactElement {
    return (
      <div className='product-card'>
        <div className='product-img_container'>
          <img src={image} alt='Ceramic Plant' />
        </div>
        <p className='medium'>Ceramic Plant</p>
        <span className='extra-light'>{price}</span>
      </div>
    );
  }

  return (
    <>
      <Header size={size} />
      <main className='main'>
        <div className='_container'>
          <section className='main_welcome-info'>
            <div className='main_welcome_content'>
              <div className='main_welcome_header_container'>
                <h1 className='main_welcome_header'>
                  The best stories start with flowers
                </h1>
              </div>
              <div className='main_welcome_customers-experience'>
                <div className='flowers'>
                  <p className='main_welcome_customers-experience_counter light'>
                    50+
                  </p>
                  <p className='main_welcome_customers-experience_text medium'>
                    Flowers
                  </p>
                </div>
                <div className='separator'></div>
                <div className='customers'>
                  <p className='main_welcome_customers-experience_counter light'>
                    100+
                  </p>
                  <p className='main_welcome_customers-experience_text medium'>
                    Customers
                  </p>
                </div>
              </div>
              <div className='main_welcome_button_container'>
                <button
                  className='main_welcome_button'
                  onClick={() => {
                    navigate('/catalog');
                  }}
                >
                  <span className='main_welcome_button_span'>Shop now</span>
                </button>
              </div>
            </div>
          </section>
          <section className='main_about-us'>
            <div className='main_about-us-content'>
              <div className='main_about-us_header-container'>
                <div className='main_about-us_under-header'>
                  {' '}
                  <p className='extra-light'>Who we are</p>
                </div>
                <div className='main_about-us_header'>
                  <h2>Flower’s Wonders Expedition</h2>
                </div>
                <div className='img-container'>
                  <Branch className='main_about-us_branch' />
                </div>
              </div>
              <div className='main_about-us_text_container'>
                <div className='main_about-us_text'>
                  <p className='medium'>
                    This website was created as an educational project for the
                    <a
                      href='https://rs.school/'
                      target='_blank'
                      className='rss_link'
                    >
                      {' '}
                      RSSchool
                    </a>{' '}
                    courses.
                  </p>
                  <p className='extra-light main_about-us_p'>
                    It serves as a demonstration of web development techniques
                    and is not a commercial product. Built with HTML, CSS,
                    TypeScript, React, and CommerceTools, it showcases practical
                    implementation of frontend development and e-commerce
                    integration
                  </p>
                  <p className='extra-light main_about-us_p'>
                    Thank you for visiting!
                  </p>
                </div>
                <div className='main_about-us_button'>
                  <button>
                    <span>About us</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className='main_saled_plants'>
            <div className='main_saled_plants_content'>
              <div className='main_saled_plants_header_container'>
                <p className='extra-light'>New Collection</p>
                <div className='branch_container'>
                  <BlackBranch />
                </div>
                <h2>House Creative Plant</h2>
              </div>
              <div className='grid-container'>
                {products.slice(0, 3).map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}

                <div className='featured'>
                  <img src={Pionies} alt='Featured Plant' />
                  <div className='pionies-label'>
                    <p className='extra-light'>We also have peonies</p>
                    <div className='pionies_button-container'>
                      <button>
                        <span>view more</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className='right-column'>
                  {products.slice(3, 4).map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

                {products.slice(4).map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </div>
          </section>
          <section className='main_promo'>
            <div className='main_promo_content'>
              <div className='main_promo_header_container'>
                <p className='extra-light'>Promo code</p>
                <WhiteBranch />
              </div>
              <div className='main_promo_text'>
                <h3>
                  Use the promo code HAPPY to get a 10% discount on houseplants.
                </h3>
              </div>
            </div>
          </section>
          <section className='main_flowers-category'>
            <div className='main_flowers-category_content'>

              <div className='flower-grid'>
              <div className='left-text'>
                <p className='extra-light'>Discover category</p>
                <h2>All kind of Flowers</h2>
                <BrownBranch />
              </div>

              {flowers.map((flower, index) => (
                <div className='flower-card' key={index}>
                  <img src={flower.image} alt={flower.name} />
                  <p className='regular'>{flower.name}</p>
                </div>
              ))}</div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MainPage;
