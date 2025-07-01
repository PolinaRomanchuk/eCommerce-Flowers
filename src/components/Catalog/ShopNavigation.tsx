import { useNavigate } from 'react-router-dom';
import './shop-nav.scss';
import { useEffect, type ReactElement } from 'react';

type ShopNavigationProps = {
  category?: string;
  subcategory?: string;
  productName?: string;
  setCategory?: React.Dispatch<React.SetStateAction<string>>;
  setSubcategory?: React.Dispatch<React.SetStateAction<string>>;
};

export const ShopNavigation = ({
  category,
  subcategory,
  productName,
  setCategory,
  setSubcategory,
}: ShopNavigationProps): ReactElement => {
  let navigate = useNavigate();
  useEffect(() => {}, [category]);

  return (
    <>
      <div className='shop_navigation'>
        <div className='_container'>
          <div className='shop_navigation_content'>
            <div className='nav_text_container'>
              <h1>Shop</h1>
              <div className='nav-links_container'>
                <p className='extra-light' onClick={() => navigate('/')}>
                  home-
                </p>
                <p
                  className='extra-light'
                  onClick={() => {
                    navigate('/catalog');

                    setCategory?.('');
                  }}
                >
                  shop
                </p>
                {category && (
                  <p
                    className='extra-light'
                    onClick={() => {
                      setSubcategory?.('');
                    }}
                  >
                    -{category}
                  </p>
                )}
                {subcategory && (
                  <p
                    className='extra-light'
                    
                  >
                    -{subcategory}
                  </p>
                )}
                {productName && <p className='extra-light'>-{productName}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopNavigation;
