import { useNavigate } from 'react-router-dom';
import './shop-nav.scss';
import { useEffect, useState, type ReactElement } from 'react';
import { fetchCategoryName } from '../../services/categories/categories';

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
  const [categoryName, setCategoryName] = useState('');
  const [subCategoryName, setSubcategoryName] = useState('');

  useEffect(() => {
    (async function getCategoriesName(): Promise<void> {
      if (category) {
        const categoryname = (await fetchCategoryName(category)).toLowerCase();
        setCategoryName(categoryname);
      }

      if (subcategory) {
        const subcategoryname = (
          await fetchCategoryName(subcategory)
        ).toLowerCase();
        setSubcategoryName(subcategoryname);
      }
    })();
  }, [category, subcategory]);

  return (
    <>
      <div className='shop-nav'>
        <div className='_container'>
          <div className='shop-nav__content'>
            <div className='shop-nav__text-container'>
              <h1>Shop</h1>
              <div className='shop-nav__links'>
                <p className='extra-light' onClick={() => navigate('/')}>
                  home-
                </p>
                <p
                  className='extra-light'
                  onClick={() => {
                    navigate('/catalog', {
                      state: { categoryId: '', subcategoryId: '' },
                    });
                    setCategory?.('');
                    setSubcategory?.('');
                  }}
                >
                  shop
                </p>
                {category && (
                  <p
                    className='extra-light'
                    onClick={() => {
                      navigate('/catalog', {
                        state: { categoryId: category },
                      });
                      if (category) {
                        setCategory?.(category);
                        setSubcategory?.('');
                      }
                    }}
                  >
                    -{categoryName}
                  </p>
                )}
                {subcategory && (
                  <p
                    className='extra-light'
                    onClick={() => {
                      navigate('/catalog', {
                        state: {
                          categoryId: category,
                          subcategoryId: subcategory,
                        },
                      });
                      if (category && subcategory) {
                        setCategory?.(category);
                        setSubcategory?.(subcategory);
                      }
                    }}
                  >
                    -{subCategoryName}
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
