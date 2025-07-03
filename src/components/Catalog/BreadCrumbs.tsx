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
  const [isOpen, setIsOpen] = useState(false);

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

  const rootCategories = categories?.filter((cat) => !cat.parent) || [];

  const handleSelect = (id: string, name: string): void => {
    setTitle(name);
    setCategory(id);
    setIsCategoried(!!id);
    setIsOpen(false);
    if (!id) {
      setSubcategory('');
      setAllSubcategories(undefined);
    }
  };

  return (
    <div className='catalog__bread'>
      <h3> Category:</h3>
      <div className='custom-select' onClick={() => setIsOpen(!isOpen)}>
        <div className='custom-select__selected'>{title}</div>
        {isOpen && (
          <ul className='custom-select__dropdown'>
            <li
              className={!category ? 'active' : ''}
              onClick={() => handleSelect('', 'All')}
            >
              All
            </li>
            {rootCategories.map((cat) => (
              <li
                key={cat.id}
                className={category === cat.id ? 'active' : ''}
                onClick={() => handleSelect(cat.id, cat.name['en-US'])}
              >
                {cat.name['en-US']}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BreadCrumbs;
