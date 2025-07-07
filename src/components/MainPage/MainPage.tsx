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
import { fetchFilteredProducts } from '../../services/catalog/catalog';
import type { Product } from '../../types/catalog';

export type MainPageProps = HeaderProps & {};

export const MainPage = ({ size }: MainPageProps): ReactElement => {
  const navigate = useNavigate();

  const [flowerCategoryId, setFlowerCategoryId] = useState('');
  const [flowerSubcategoryCards, setFlowerSubcategoryCards] = useState<
    { name: string; image: string; id: string }[]
  >([]);

  const [plants, setPlants] = useState<Product[]>([]);

  async function loadFlowerSubcategoriesWithImages(): Promise<void> {
    const all = (await fetchCategories()).data;
    const flowerscat = all.find(
      (x) => !x.parent && x.name['en-US'] === 'Flowers',
    )?.id;
    if (flowerscat) {
      setFlowerCategoryId(flowerscat);
    }
    const flowerCategories = all.filter((x) => x.parent?.id === flowerscat);

    const flowersWithImages = await Promise.all(
      flowerCategories.map(async (category) => {
        const image = await getImageForFlowersCategory(category.id);
        return {
          name: category.name['en-US'],
          image,
          id: category.id,
        };
      }),
    );

    setFlowerSubcategoryCards(flowersWithImages);
  }

  async function getImageForFlowersCategory(
    categoryId: string,
  ): Promise<string> {
    const all = (
      await fetchFilteredProducts({ categoryId: categoryId }, '', '')
    ).products;
    const img = all.find((x) => x)?.image;
    return img ? img : '';
  }

  const plantCards = plants.map((plant) => {
    return (
      <div
        className='main__plants-product-card'
        onClick={() => navigate(`/product/${plant.id}`)}
        key={plant.id}
      >
        <div className='main__plants-product-img-wrapper'>
          <img src={plant.image} alt='Plant' />
        </div>
        <p className='medium'>{plant.name}</p>
        <span className='extra-light'>{plant.prices}$</span>
      </div>
    );
  });

  async function getPlants(): Promise<void> {
    const all = (await fetchCategories()).data;
    const plantscat = all.find(
      (x) => !x.parent && x.name['en-US'] === 'Plants',
    )?.id;

    const allplants = (
      await fetchFilteredProducts({ categoryId: plantscat }, '', '', 1, 8)
    ).products;

    setPlants(allplants);
  }

  async function handlePeonyClick(): Promise<void> {
    const types = (await fetchTypes()).data;
    const peony = types.find((x) => x.name === 'Peony')?.id;

    navigate('/catalog', {
      state: { typeId: peony },
    });
  }

  useEffect(() => {
    loadFlowerSubcategoriesWithImages();
    getPlants();
  }, []);

  return (
    <>
      <Header size={size} />
      <main className='main'>
        <div className='_container'>
          <section className='main__welcome'>
            <div className='main__welcome-content'>
              <div className='main__welcome-header-wrapper'>
                <h1 className='main__welcome-header'>
                  The best stories start with flowers
                </h1>
              </div>
              <div className='main__welcome-stats'>
                <div className='flowers'>
                  <p className='main__welcome-stats-value light'>50+</p>
                  <p className='main__welcome-stats-text medium'>Flowers</p>
                </div>
                <div className='main__welcome-separator'></div>
                <div className='customers'>
                  <p className='main__welcome-stats-value light'>100+</p>
                  <p className='main__welcome-stats-text medium'>Customers</p>
                </div>
              </div>
              <div className='main__welcome-button-wrapper'>
                <button
                  className='main__welcome-button'
                  onClick={() => {
                    navigate('/catalog');
                  }}
                >
                  <span className='main__welcome-button-text'>Shop now</span>
                </button>
              </div>
            </div>
          </section>
          <section className='main__about'>
            <div className='main__about-content'>
              <div className='main__about-header-wrapper'>
                <div className='main__about-subtitle'>
                  <p className='extra-light'>Who we are</p>
                </div>
                <div className='main__about-title'>
                  <h2>Flower’s Wonders Expedition</h2>
                </div>
                <div className='main__about-branch-container'>
                  <Branch className='main__about-branch' />
                </div>
              </div>
              <div className='main__about-text-wrapper'>
                <div className='main__about-text'>
                  <p className='medium'>
                    This website was created as an educational project for the
                    <a
                      href='https://rs.school/'
                      target='_blank'
                      className='rss_link'
                    >
                      {` RSSchool `}
                    </a>
                    courses.
                  </p>
                  <p className='extra-light main__about-paragraph'>
                    It serves as a demonstration of web development techniques
                    and is not a commercial product. Built with HTML, CSS,
                    TypeScript, React, and CommerceTools, it showcases practical
                    implementation of frontend development and e-commerce
                    integration.
                  </p>
                  <p className='extra-light main__about-paragraph'>
                    Thank you for visiting!
                  </p>
                </div>
                <div className='main__about-button-wrapper'>
                  <button onClick={() => navigate('/about')}>
                    <span>About us</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section className='main__plants'>
            <div className='main__plants-content'>
              <div className='main__plants-header-wrapper'>
                <p className='extra-light'>New Collection</p>
                <div className='main__branch-wrapper'>
                  <BlackBranch />
                </div>
                <h2 className='main__plants-header'>House Creative Plant</h2>
              </div>
              <div className='main__plants-grid'>
                {plantCards.slice(0, 4)}

                <div className='main__plants-featured'>
                  <img src={Pionies} alt='Featured Plant' />
                  <div
                    className='main__plants-pionies-label'
                    onClick={handlePeonyClick}
                  >
                    <p className='extra-light'>We also have peonies</p>
                    <div className='main__plants-button-wrapper'>
                      <button>
                        <span>view more</span>
                      </button>
                    </div>
                  </div>
                </div>

                {plantCards.slice(4, 8)}
              </div>
            </div>
          </section>
          <section className='main__promo'>
            <div className='main__promo-content'>
              <div className='main__promo-header-wrapper'>
                <p className='extra-light'>Promo code</p>
                <WhiteBranch />
              </div>
              <div className='main__promo-text'>
                <h3>
                  Use the promo code HAPPY to get a 10% discount on houseplants.
                </h3>
              </div>
            </div>
          </section>
          <section className='main__flowers'>
            <div className='main__flowers-content'>
              <div className='main__flowers-grid'>
                <div className='main__flowers-intro'>
                  <p className='extra-light'>Discover category</p>
                  <h2>All kind of Flowers</h2>
                  <BrownBranch />
                </div>

                {flowerSubcategoryCards?.map((flower, index) => (
                  <div
                    className='main__flowers-card'
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
