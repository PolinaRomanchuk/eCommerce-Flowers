import { useEffect, useState, type ReactElement } from 'react';
import type { ProductType } from '../../types/categories';
import {
  fetchColors,
  fetchOccasions,
  fetchTypes,
} from '../../services/categories/categories';

type FilterCatalogProps = {
  filterAttributes: {
    color: string;
    occasion: string;
    price: string;
    type: string;
  };
  setFilterAttributes: React.Dispatch<
    React.SetStateAction<{
      color: string;
      occasion: string;
      price: string;
      type: string;
    }>
  >;
  setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FilterCatalog = ({
  filterAttributes,
  setFilterAttributes,
  setIsFiltered,
}: FilterCatalogProps): ReactElement => {
  const [types, setTypes] = useState<ProductType[]>();
  const [colors, setcolors] = useState<string[]>();
  const [occasions, setOccasions] = useState<string[]>();

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const types = await fetchTypes();
      const colors = await fetchColors();
      const occasions = await fetchOccasions();

      if (types) {
        setTypes(types.data);
      }

      if (colors) {
        setcolors(colors);
      }
      if (occasions) {
        setOccasions(occasions);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='catalog__filter'>
      <div className='catalog__filter__properties'>
        <div className='catalog__filter__price'>
          <label className='catalog__filter__price__label' htmlFor=''>
            Price:
          </label>
          <select
            key={filterAttributes.price}
            value={filterAttributes.price}
            onChange={(event) => {
              setFilterAttributes((previous) => ({
                ...previous,
                price: event.target.value,
              }));
              setIsFiltered(!!event.target.value);
            }}
          >
            <option value=''>All</option>
            <option value='0-50'>{'<50$'}</option>
            <option value='50-100'>{'50$ - 100$'}</option>
            <option value='100-1000'>{'>100$'}</option>
          </select>
        </div>

        <div className='catalog__filter__color'>
          <label className='catalog__filter__color__label' htmlFor=''>
            Color:
          </label>
          <select
            key={filterAttributes.color}
            value={filterAttributes.color}
            onChange={(event) => {
              setFilterAttributes((previous) => ({
                ...previous,
                color: event.target.value,
              }));
              setIsFiltered(!!event.target.value);
            }}
          >
            <option value=''>All</option>
            {colors?.map((color) => <option value={color} key={color}>{color}</option>)}
          </select>
        </div>

        <div className='catalog__filter__type'>
          <label className='catalog__filter__type__label' htmlFor=''>
            Type:
          </label>
          <select
            key={filterAttributes.type}
            value={filterAttributes.type}
            onChange={(event) => {
              setFilterAttributes((previous) => ({
                ...previous,
                type: event.target.value,
              }));
              setIsFiltered(!!event.target.value);
            }}
          >
            <option value=''>All</option>
            {types?.map((type) => (
              <option key={type.name} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className='catalog__filter__occasions'>
          <label className='catalog__filter__type__label' htmlFor=''>
            Occasions:
          </label>
          <select
            key={filterAttributes.occasion}
            value={filterAttributes.occasion}
            onChange={(event) => {
              setFilterAttributes((previous) => ({
                ...previous,
                occasion: event.target.value,
              }));
              setIsFiltered(!!event.target.value);
            }}
          >
            <option value=''>All</option>
            {occasions?.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterCatalog;
