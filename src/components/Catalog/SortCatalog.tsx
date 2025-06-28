import { useState, type ReactElement } from 'react';
import Arrow from '../../assets/Catalog/arrow.png';
import type { Product } from '../../types/catalog';
import { fetchProductsAttributes } from '../../services/catalog/catalog';
type SortCatalogProps = {
  sortAttributes: string;
  setSortAttributes: React.Dispatch<React.SetStateAction<string>>;
  token: string | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  filterAttributes: {
    color: string;
    size: string;
    price: string;
    type: string;
  };
  search: string;
};
export const SortCatalog = ({
  sortAttributes,
  setSortAttributes,
  setProducts,
  filterAttributes,
  search,
}: SortCatalogProps): ReactElement => {
  const [show, setIsShow] = useState(false);

  async function getProducts(sortAttributes: string): Promise<Product[]> {
    const { products, total } = await fetchProductsAttributes(
      filterAttributes,
      sortAttributes,
      search,
    );
    return products;
  }

  return (
    <div className='catalog__sort'>
      {show && (
        <div className='catalog__sort__properties'>
          <div
            onClick={() =>
              sortAttributes === 'price asc'
                ? setSortAttributes('price desc')
                : setSortAttributes('price asc')
            }
            className={`catalog__sort__price ${sortAttributes === 'price asc' || sortAttributes === 'price desc' ? 'active' : ''}`}
          >
            <button
              onClick={async () => {
                setProducts(
                  await getProducts(
                    sortAttributes === 'price asc' ? 'price desc' : 'price asc',
                  ),
                );
              }}
              className='catalog__sort__price__button'
            >
              Price
            </button>
            <div
              className={`catalog__sort__price__img ${sortAttributes === 'price asc' ? 'up' : ''}`}
            >
              <img src={Arrow} alt='' />
            </div>
          </div>
          <div
            onClick={() =>
              sortAttributes === 'name.en-US asc'
                ? setSortAttributes('name.en-US desc')
                : setSortAttributes('name.en-US asc')
            }
            className={`catalog__sort__name ${sortAttributes === 'name.en-US desc' || sortAttributes === 'name.en-US asc' ? 'active' : ''}`}
          >
            <button
              onClick={async () => {
                setProducts(
                  await getProducts(
                    sortAttributes === 'name.en-US asc'
                      ? 'name.en-US desc'
                      : 'name.en-US asc',
                  ),
                );
              }}
              className='catalog__sort__name__button'
            >
              Name
            </button>
            <div
              className={`catalog__sort__name__img ${sortAttributes === 'name.en-US asc' ? 'up' : ''}`}
            >
              <img src={Arrow} alt='' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortCatalog;
