import { useEffect, useState, type ReactElement } from 'react';
import type { Product } from '../../types/catalog';
import { fetchCategories } from '../../services/categories/categories';
import type { Category } from '../../types/categories';

type BreadCrumbsProps = {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  subcategory: string;
  setSubcategory: React.Dispatch<React.SetStateAction<string>>;
  setIsCategoried: React.Dispatch<React.SetStateAction<boolean>>;
  allSubcategories: Category[] | undefined;
  setAllSubcategories: React.Dispatch<
    React.SetStateAction<Category[] | undefined>
  >;
};
export const BreadCrumbs = ({
  category,
  setCategory,
  setSubcategory,
  setIsCategoried,
  setAllSubcategories: setAllSubcategories,
}: BreadCrumbsProps): ReactElement => {
  let [title, setTitle] = useState('All');

  const [categories, setCategories] = useState<Category[]>();

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const data = await fetchCategories();

      if (data) {
        setCategories(data.data);
      }
    }
    fetchData();
  }, [category]);

  useEffect(() => {
    const sub = categories?.filter((cat) => cat.parent?.id === category);
    if (sub) {
      setAllSubcategories(sub);
    }
  }, [categories, category, setAllSubcategories]);

  return (
    <div className='catalog__bread'>
      <div className='catalog__bread__container'>
        <div className='catalog__filter__category'>
          <label className='catalog__filter__type__label' htmlFor=''>
            Category:
          </label>
          <select
            value={category}
            onChange={async (event) => {
              const selected = event.target.value;
              setTitle('All');
              setCategory(selected);
              setIsCategoried(!!selected);
              if (!selected) {
                setSubcategory('');
                setAllSubcategories(undefined);
              }
            }}
          >
            <option value=''>All</option>
            {categories
              ?.filter((cat) => !cat.parent)
              .map((cat) => (
                <option value={cat.id}>{cat.name['en-US']}</option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BreadCrumbs;
