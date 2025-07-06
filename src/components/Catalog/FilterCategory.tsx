import { useEffect, useState, type ReactElement } from 'react';
import { fetchCategories } from '../../services/categories/categories';
import type { Category } from '../../types/categories';

type FilterCategoryProps = {
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
export const FilterCategory = ({
  category,
  setCategory,
  setSubcategory,
  setIsCategoried,
  setAllSubcategories: setAllSubcategories,
}: FilterCategoryProps): ReactElement => {
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
    <div className='catalog__category'>
      <p className='regular'>Category:</p>
      <div className='custom-select' onClick={() => setIsOpen(!isOpen)}>
        <div className='custom-select--selected'>{title}</div>
        {isOpen && (
          <ul className='custom-select-dropdown'>
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

export default FilterCategory;
