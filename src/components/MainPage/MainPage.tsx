import { useEffect, useState, type ReactElement } from 'react';
import './main.scss';
import Header, { type HeaderProps } from '../Header/Header';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Branch } from './../../assets/Main/branch.svg';
import { ReactComponent as BlackBranch } from './../../assets/Main/branch2.svg';
import { ReactComponent as WhiteBranch } from './../../assets/Main/branch3.svg';
import { ReactComponent as BrownBranch } from './../../assets/Main/branch6.svg';
import Pionies from '../../assets/Main/pion.jpg';

import {
  fetchCategories,
  fetchTypes,
} from '../../services/categories/categories';
import type { Category } from '../../types/categories';
import { fetchFilteredProducts } from '../../services/catalog/catalog';
import type { Product } from '../../types/catalog';

export type MainPageProps = HeaderProps & {};

export const MainPage = ({ size }: MainPageProps): ReactElement => {
  const navigate = useNavigate();

  const [flCategories, setFlCategories] = useState<Category[]>();

  const [flowerCategoryId, setFlowerCategoryId] = useState('');
  const [flowers, setFlowers] = useState<
    { name: string; image: string; id: string }[]
  >([]);

  const [plants, setPlants] = useState<Product[]>([]);

  async function getFlowersCategories(): Promise<void> {
    const all = (await fetchCategories()).data;
    const flowerscat = all.find(
      (x) => !x.parent && x.name['en-US'] === 'Flowers',
    )?.id;
    if (flowerscat) {
      setFlowerCategoryId(flowerscat);
    }
    const flowerCategories = all.filter((x) => x.parent?.id === flowerscat);
    setFlCategories(flowerCategories);

    const flowersWithImages = await Promise.all(
      flowerCategories.map(async (category) => {
        const image = await getFlowersCategoriesImg(category.id);
        return {
          name: category.name['en-US'],
          image,
          id: category.id,
        };
      }),
    );

    setFlowers(flowersWithImages);
  }

  async function getFlowersCategoriesImg(categoryId: string): Promise<string> {
    const all = (
      await fetchFilteredProducts({ categoryId: categoryId }, '', '')
    ).products;
    const img = all.find((x) => x)?.image;
    return img ? img : '';
  }

  const cards = plants.map((plant) => {
    return (
      <div
        className='product-card'
        onClick={() => navigate(`/product/${plant.id}`)}
      >
        <div className='product-img_container'>
          <img src={plant.image} alt='Plant' />
        </div>
        <p className='medium'>{plant.name}</p>
        <span className='extra-light'>{plant.prices}</span>
      </div>
    );
  });

  async function getPlants(): Promise<void> {
    const all = (await fetchCategories()).data;
    const plantscat = all.find(
      (x) => !x.parent && x.name['en-US'] === 'Plants',
    )?.id;

    const allplants = (
      await fetchFilteredProducts({ categoryId: plantscat }, '', '')
    ).products;

    setPlants(allplants);
  }

  async function handleClick(): Promise<void> {
    const types = (await fetchTypes()).data;
    const peony = types.find((x) => x.name === 'Peony')?.id;

    navigate('/catalog', {
      state: { typeId: peony },
    });
  }

  useEffect(() => {
    getFlowersCategories();
    getPlants();
  }, []);

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
                  <button onClick={() => navigate('/about')}>
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
                {cards.slice(0, 3)}

                <div className='featured'>
                  <img src={Pionies} alt='Featured Plant' />
                  <div className='pionies-label' onClick={handleClick}>
                    <p className='extra-light'>We also have peonies</p>
                    <div className='pionies_button-container'>
                      <button>
                        <span>view more</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className='right-column'>{cards.slice(3, 4)}</div>

                {cards.slice(4)}
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

                {flowers?.map((flower, index) => (
                  <div
                    className='flower-card'
                    key={index}
                    onClick={() => {
                      navigate('/catalog', {
                        state: {
                          categoryId: flowerCategoryId,
                          subcategoryId: flower.id,
                        },
                      });
                    }}
                  >
                    <img src={flower.image} alt='' />
                    <p className='regular'>{flower.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MainPage;
