import { useState, type ReactElement } from 'react';
import type { Product } from '../../types/catalog';
import { fetchFilteredProducts } from '../../services/catalog/catalog';
import { ReactComponent as SortIcon } from './../../assets/Catalog/sort-alt.svg';

type SortCatalogProps = {
  sortAttributes: string;
  setSortAttributes: React.Dispatch<React.SetStateAction<string>>;
  token: string | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  filterAttributes: {
    color: string;
    occasion: string;
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
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { label: 'default', value: '' },
    { label: 'price low to high', value: 'price asc' },
    { label: 'price high to low', value: 'price desc' },
    { label: 'name A to Z', value: 'name.en-US asc' },
    { label: 'name Z to A', value: 'name.en-US desc' },
  ];

  async function getProducts(sortAttributes: string): Promise<Product[]> {
    const { products, total } = await fetchFilteredProducts(
      filterAttributes,
      sortAttributes,
      search,
    );
    return products;
  }

  const handleSelect = async (value: string): Promise<void> => {
    setIsOpen(false);
    setSortAttributes(value);
    const products = await getProducts(value);
    setProducts(products);
  };

  return (
    <div className='catalog__sort'>
      <button
        type='button'
        className='catalog__sort-button'
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <SortIcon className='conf-icon' />
        <span>
          {sortAttributes === 'price asc' || sortAttributes === 'price desc'
            ? 'Price'
            : sortAttributes === 'name.en-US asc' ||
                sortAttributes === 'name.en-US desc'
              ? 'Name'
              : 'Sort'}
        </span>
      </button>
      {isOpen && (
        <ul className='catalog__sort-dropdown'>
          {options.map((option) => (
            <li
              key={option.value}
              className={`catalog__sort-option ${
                sortAttributes === option.value ? 'active' : ''
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortCatalog;
