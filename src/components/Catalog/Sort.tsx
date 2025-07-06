import { useState, type ReactElement } from 'react';
import { ReactComponent as SortIcon } from './../../assets/Catalog/sort-alt.svg';

type SortCatalogProps = {
  sortAttributes: string;
  setSortAttributes: React.Dispatch<React.SetStateAction<string>>;
  setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>;
};
export const Sort = ({
  sortAttributes,
  setSortAttributes,
  setIsFiltered,
}: SortCatalogProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { label: 'default', value: '' },
    { label: 'price low to high', value: 'price asc' },
    { label: 'price high to low', value: 'price desc' },
    { label: 'name A to Z', value: 'name.en-US asc' },
    { label: 'name Z to A', value: 'name.en-US desc' },
  ];

  const handleSelect = async (value: string): Promise<void> => {
    setIsOpen(false);
    setSortAttributes(value);
    setIsFiltered(!!value);
  };

  return (
    <div className='catalog__sort'>
      <button
        type='button'
        className='catalog__sort-button'
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <span>
          <SortIcon className='catalog-icon' />
          <p>
            {' '}
            {sortAttributes === 'price asc' || sortAttributes === 'price desc'
              ? 'price'
              : sortAttributes === 'name.en-US asc' ||
                  sortAttributes === 'name.en-US desc'
                ? 'name'
                : 'sort'}
          </p>
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

export default Sort;
