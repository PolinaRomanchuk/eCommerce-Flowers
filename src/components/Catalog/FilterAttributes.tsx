import { useEffect, useState, type ReactElement } from 'react';
import type { ProductType } from '../../types/categories';
import {
  fetchColors,
  fetchOccasions,
  fetchTypes,
} from '../../services/categories/categories';

type FilterAttributesProps = {
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

export const FilterAttributes = ({
  filterAttributes,
  setFilterAttributes,
  setIsFiltered,
}: FilterAttributesProps): ReactElement => {
  const [types, setTypes] = useState<ProductType[]>();
  const [colors, setcolors] = useState<string[]>();
  const [occasions, setOccasions] = useState<string[]>();
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (): void => {
      setTypeDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);

    return (): void => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='catalog__filter'>
      <div className='catalog__filter__properties'>
        <div className='catalog__filter__price'>
          <p className='regular'>Price:</p>
          <div className='catalog__filter__price-options'>
            <button
              className={!filterAttributes.price ? 'active' : ''}
              onClick={() => {
                setFilterAttributes((previous) => ({ ...previous, price: '' }));
                setIsFiltered(false);
              }}
            >
              All
            </button>
            <button
              className={filterAttributes.price === '0-50' ? 'active' : ''}
              onClick={() => {
                setFilterAttributes((previous) => ({
                  ...previous,
                  price: '0-50',
                }));
                setIsFiltered(true);
              }}
            >
              {'<50$'}
            </button>
            <button
              className={filterAttributes.price === '50-100' ? 'active' : ''}
              onClick={() => {
                setFilterAttributes((previous) => ({
                  ...previous,
                  price: '50-100',
                }));
                setIsFiltered(true);
              }}
            >
              {'50$ - 100$'}
            </button>
            <button
              className={filterAttributes.price === '100-1000' ? 'active' : ''}
              onClick={() => {
                setFilterAttributes((previous) => ({
                  ...previous,
                  price: '100-1000',
                }));
                setIsFiltered(true);
              }}
            >
              {'>100$'}
            </button>
          </div>
        </div>

        <div className='catalog__filter__color'>
          <p className='regular'>Color:</p>
          <div className='catalog__filter__color-options'>
            <button
              className={!filterAttributes.color ? 'active' : ''}
              onClick={() => {
                setFilterAttributes((previous) => ({ ...previous, color: '' }));
                setIsFiltered(false);
              }}
            >
              All
            </button>
            {colors?.map((color) => (
              <button
                key={color}
                className={filterAttributes.color === color ? 'active' : ''}
                onClick={() => {
                  setFilterAttributes((previous) => ({ ...previous, color }));
                  setIsFiltered(true);
                }}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div className='catalog__filter__occasions'>
          <p className='regular'>Occasions:</p>
          <div className='catalog__filter__occasions-options'>
            <button
              className={!filterAttributes.occasion ? 'active' : ''}
              onClick={() => {
                setFilterAttributes((previous) => ({
                  ...previous,
                  occasion: '',
                }));
                setIsFiltered(false);
              }}
            >
              All
            </button>
            {occasions?.map((occasion) => (
              <button
                key={occasion}
                className={
                  filterAttributes.occasion === occasion ? 'active' : ''
                }
                onClick={() => {
                  setFilterAttributes((previous) => ({
                    ...previous,
                    occasion,
                  }));
                  setIsFiltered(true);
                }}
              >
                {occasion}
              </button>
            ))}
          </div>
        </div>

        <div className='catalog__filter__type'>
          <p className='regular'>Type:</p>

          <div
            className='custom-select'
            onClick={(event) => {
              event.stopPropagation();
              setTypeDropdownOpen((previous) => !previous);
            }}
          >
            <div className='custom-select--selected'>
              {types?.find((t) => t.id === filterAttributes.type)?.name ||
                'All'}
            </div>
            {typeDropdownOpen && (
              <ul
                className='custom-select-dropdown'
                onClick={(event) => event.stopPropagation()}
              >
                <li
                  className={!filterAttributes.type ? 'active' : ''}
                  onClick={() => {
                    setFilterAttributes((previous) => ({
                      ...previous,
                      type: '',
                    }));
                    setIsFiltered(false);
                    setTypeDropdownOpen(false);
                  }}
                >
                  All
                </li>
                {types?.map((type) => (
                  <li
                    key={type.id}
                    className={
                      filterAttributes.type === type.id ? 'active' : ''
                    }
                    onClick={() => {
                      setFilterAttributes((previous) => ({
                        ...previous,
                        type: type.id,
                      }));
                      setIsFiltered(true);
                      setTypeDropdownOpen(false);
                    }}
                  >
                    {type.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterAttributes;
