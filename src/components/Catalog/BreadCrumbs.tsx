import { useState, type ReactElement } from 'react';
import { getCategories } from '../../services/catalog/catalog';
import type { Product } from '../../types/catalog';

type BreadCrumbsProps = {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  subcategory: string;
  setSubcategory: React.Dispatch<React.SetStateAction<string>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setIsCategoried: React.Dispatch<React.SetStateAction<boolean>>;
};
export const BreadCrumbs = ({
  category,
  setCategory,
  setProducts,
  subcategory,
  setSubcategory,
  setIsCategoried,
}: BreadCrumbsProps): ReactElement => {
  let [title, setTitle] = useState('All');
  const [show, setShow] = useState(false);

  async function getProducts(category: string): Promise<Product[]> {
    const { products, total } = await getCategories(category);
    return products;
  }

  return (
    <div className='catalog__bread'>
      {category ? (
        <div className='bread__links'>
          <a
            href='#'
            onClick={() => {
              setCategory('');
              setIsCategoried(false);
            }}
            className='bread__link'
          >
            Home
          </a>
          <a
            href='#'
            onClick={async () => {
              if (title !== 'All') {
                setTitle('All');
                setProducts(await getProducts(category));
              }
            }}
            className='bread__link'
          >
            {category === 'cc09111e-e236-43dc-bcee-e0124acbf7b5'
              ? 'man'
              : 'women'}
          </a>
          {title !== 'All' ? (
            <a href='#' className='bread__link'>
              {title}
            </a>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}

      {show && (
        <div className='catalog__bread__container'>
          <label className='catalog__bread__title' htmlFor=''>
            Choose category
          </label>
          <select
            value={category}
            onChange={async (event) => {
              setTitle('All');
              setCategory(event.target.value);
              setIsCategoried(true);
              // setProducts(await getProducts(event.target.value));
            }}
            name=''
            id=''
          >
            <option value=''>All</option>
            <option value='cc09111e-e236-43dc-bcee-e0124acbf7b5'>Man</option>
            <option value='067e3264-b3b7-4c22-90d7-bb60da81af66'>Women</option>
          </select>
          {category === 'cc09111e-e236-43dc-bcee-e0124acbf7b5' ? (
            <>
              <label className='catalog__bread__title' htmlFor=''>
                Choose subcategory
              </label>
              <select
                value={subcategory}
                onChange={async (event) => {
                  setTitle(
                    event.target.options[event.target.selectedIndex].text,
                  );
                  setSubcategory(event.target.value);
                  setIsCategoried(true);
                  //   setProducts(await getProducts(event.target.value));
                }}
                name=''
                id=''
              >
                <option value=''>All</option>
                <option value='5124ec8e-4e02-48c7-8d0c-4328b9a16827'>
                  Outerwear
                </option>
                <option value='191afa2f-8018-46a4-bd4a-a82411507edb'>
                  underwear
                </option>
              </select>
            </>
          ) : (
            ''
          )}
          {category === '067e3264-b3b7-4c22-90d7-bb60da81af66' ? (
            <>
              <label htmlFor=''>Choose subcategory</label>
              <select
                value={subcategory}
                onChange={async (event) => {
                  setTitle(
                    event.target.options[event.target.selectedIndex].text,
                  );
                  setSubcategory(event.target.value);
                  setIsCategoried(true);
                  //  setProducts(await getProducts(event.target.value));
                }}
                name=''
                id=''
              >
                <option value=''>All</option>
                <option value='a8828868-f3f3-43bb-8bc9-45bf312e245e'>
                  tops
                </option>
                <option value='52bcf46c-ef63-44c8-a514-d35d267881ec'>
                  dresses
                </option>
                <option value='79b5b02c-0302-40fe-9e63-ec552fe163a4'>
                  Pants
                </option>
                <option value='c245d4c9-8bc2-4f28-ab91-26cbe4bc61f3'>
                  Skirts
                </option>
              </select>
            </>
          ) : (
            ''
          )}
        </div>
      )}
    </div>
  );
};

export default BreadCrumbs;
