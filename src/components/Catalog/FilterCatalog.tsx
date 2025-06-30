import { useEffect, useState, type ReactElement } from 'react';
import type { Product } from '../../types/catalog';
import type { ProductType, Category } from '../../types/categories';
import {
  fetchCategories,
  fetchColors,
  fetchOccasions,
  fetchTypes,
} from '../../services/categories/categories';

type FilterCatalogProps = {
  token: string | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
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
};
export const FilterCatalog = ({
  filterAttributes,
  setFilterAttributes,
}: FilterCatalogProps): ReactElement => {
  const [categories, setCategories] = useState<Category[]>();
  const [types, setTypes] = useState<ProductType[]>();
  const [colors, setcolors] = useState<string[]>();

  const [occasions, setOccasions] = useState<string[]>();

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const data = await fetchCategories();
      const types = await fetchTypes();
      const  colors = await fetchColors();
      const occasions = await fetchOccasions();

      if (data && types) {
        setCategories(data.data);
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
            value={filterAttributes.price}
            onChange={(event) =>
              setFilterAttributes((previous) => ({
                ...previous,
                price: event.target.value,
              }))
            }
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
            value={filterAttributes.color}
            onChange={(event) =>
              setFilterAttributes((previous) => ({
                ...previous,
                color: event.target.value,
              }))
            }
          >
            <option value=''>All</option>
            {colors?.map((color) => (
              <option value={color}>{color}</option>
            ))}
          </select>
        </div>

        <div className='catalog__filter__type'>
          <label className='catalog__filter__type__label' htmlFor=''>
            Type:
          </label>
          <select
            value={filterAttributes.type}
            onChange={(event) =>
              setFilterAttributes((previous) => ({
                ...previous,
                type: event.target.value,
              }))
            }
          >
            <option value=''>All</option>
            {types?.map((type) => <option key={type.name} value={type.id}>{type.name}</option>)}
            <option value=''></option>
          </select>
        </div>
        <div className='catalog__filter__occasions'>
          <label className='catalog__filter__type__label' htmlFor=''>
            Occasions:
          </label>
          <select
            value={filterAttributes.occasion}
            onChange={(event) =>
              setFilterAttributes((previous) => ({
                ...previous,
                occasion: event.target.value,
              }))
            }
          >
            <option value=''>All</option>
            {occasions?.map((occasion) => (
              <option key={occasion} value={occasion}>{occasion}</option>
            ))}
          </select>
        </div>
        <div className='catalog__filter__category'>
          <label className='catalog__filter__type__label' htmlFor=''>
            Category:
          </label>
          <select
            value={filterAttributes.type}
            onChange={(event) =>
              setFilterAttributes((previous) => ({
                ...previous,
                type: event.target.value,
              }))
            }
          >
            <option value=''>All</option>
            {categories
              ?.filter((cat) => !cat.parent)
              .map((cat) => (
                <option value={cat.id}>{cat.name['en-US']}</option>
              ))}
            <option value=''></option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterCatalog;
