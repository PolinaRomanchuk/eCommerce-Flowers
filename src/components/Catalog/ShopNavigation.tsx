import { useNavigate } from 'react-router-dom';
import './shop-nav.scss';
import type { ReactElement } from 'react';
import Photo from '../../assets/Catalog/shop.png';

export const Error = (): ReactElement => {
  let navigate = useNavigate();
  return (
    <>
      <div className='shop_navigation'>
        <div className='_container'>
          <div className='shop_navigation_content'>
            <div className='nav_text_container'>
              <h1>Shop</h1>
              <div className='nav-links_container'>
                <p className='extra-light'>home-</p>
                <p className='extra-light'>shop-</p>
                <p className='extra-light'>category-</p>
                <p className='extra-light'>subcategory-</p>
                <p className='extra-light'>product</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
