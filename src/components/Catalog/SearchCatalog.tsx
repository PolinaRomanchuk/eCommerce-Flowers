import type { ReactElement } from 'react';
import type { Product } from '../../types/catalog';
import { fetchProductsAttributes } from '../../services/catalog/catalog';

type SearchCatalogProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  token: string | null;
  filterAttributes: {
    color: string;
    size: string;
    price: string;
    type: string;
  };
  sortAttributes: string;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};
export const SearchCatalog = ({
  search,
  setSearch,
  filterAttributes,
  sortAttributes,
  setProducts,
}: SearchCatalogProps): ReactElement => {
  async function getProducts(value: string): Promise<Product[]> {
    const { products, total } = await fetchProductsAttributes(
      filterAttributes,
      sortAttributes,
      value,
    );
    return products;
  }
  return (
    <div className='catalog__search'>
      <input
        value={search}
        onChange={async (event) => {
          setSearch(event.target.value);
          setProducts(await getProducts(event.target.value.trim()));
        }}
        type='text'
        className='catalog__search__input'
      />
    </div>
  );
};

export default SearchCatalog;
