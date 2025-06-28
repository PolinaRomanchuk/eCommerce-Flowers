import { type ReactElement } from 'react';
import type { Product } from '../../types/catalog';

type FilterCatalogProps = {
  token: string | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  filterAttributes: {
    color: string;
    size: string;
    price: string;
    type: string;
  };
  setFilterAttributes: React.Dispatch<
    React.SetStateAction<{
      color: string;
      size: string;
      price: string;
      type: string;
    }>
  >;
};
export const FilterCatalog = ({
  filterAttributes,
  setFilterAttributes,
}: FilterCatalogProps): ReactElement => {
  /*useEffect(() => {
         //console.log(filterAttributes);
   
      }, [filterAttributes])*/
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
            <option value='0-150'>{'<150$'}</option>
            <option value='150-300'>{'150$ - 300$'}</option>
            <option value='500-1000'>{'500$ - 1000$'}</option>
            <option value='1000-999999'>{'>1000$'}</option>
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
            <option value='black'>Black</option>
            <option value='gray'>Gray</option>
            <option value='white'>White</option>
            <option value='pink'>Pink</option>
            <option value='green'>Green</option>
            <option value='brown'>Brown</option>
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
            <option value='b6ac86b1-9e9a-4a8d-8161-4709a4a1ac55'>Jeans</option>
            <option value='7062c3a3-1388-4466-ac0a-a65a9d57a4e3'>Shorts</option>
            <option value='9b77015b-2da2-4241-8984-61120e660b8b'>Suits</option>
            <option value='09211447-5c09-4ea0-8aef-a440fbc128cd'>Skirt</option>
            <option value='ca1a7d34-092e-4d2e-904d-1b603fb72685'>
              T-shirt
            </option>
            <option value='b424371e-ba03-40d8-8d77-345a3f169aa0'>Dress</option>
            <option value='ce059c1f-ddf9-4252-aa1e-8a4023684cbf'>Hoody</option>
            <option value=''></option>
          </select>
        </div>
         <div className='catalog__filter__occasions'>
          <label className='catalog__filter__type__label' htmlFor=''>
           Occasions:
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
            <option value='b6ac86b1-9e9a-4a8d-8161-4709a4a1ac55'>Jeans</option>
            <option value='7062c3a3-1388-4466-ac0a-a65a9d57a4e3'>Shorts</option>
            <option value='9b77015b-2da2-4241-8984-61120e660b8b'>Suits</option>
            <option value='09211447-5c09-4ea0-8aef-a440fbc128cd'>Skirt</option>
            <option value='ca1a7d34-092e-4d2e-904d-1b603fb72685'>
              T-shirt
            </option>
            <option value='b424371e-ba03-40d8-8d77-345a3f169aa0'>Dress</option>
            <option value='ce059c1f-ddf9-4252-aa1e-8a4023684cbf'>Hoody</option>
            <option value=''></option>
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
            <option value='b6ac86b1-9e9a-4a8d-8161-4709a4a1ac55'>Jeans</option>
            <option value='7062c3a3-1388-4466-ac0a-a65a9d57a4e3'>Shorts</option>
            <option value='9b77015b-2da2-4241-8984-61120e660b8b'>Suits</option>
            <option value='09211447-5c09-4ea0-8aef-a440fbc128cd'>Skirt</option>
            <option value='ca1a7d34-092e-4d2e-904d-1b603fb72685'>
              T-shirt
            </option>
            <option value='b424371e-ba03-40d8-8d77-345a3f169aa0'>Dress</option>
            <option value='ce059c1f-ddf9-4252-aa1e-8a4023684cbf'>Hoody</option>
            <option value=''></option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default FilterCatalog;
