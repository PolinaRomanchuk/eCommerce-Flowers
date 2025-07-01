import type { ReactElement } from 'react';

type SearchCatalogProps = {
  searchKeyword: string;
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
  setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>;
};
export const SearchCatalog = ({
  searchKeyword,
  setSearchKeyword,
  setIsFiltered,
}: SearchCatalogProps): ReactElement => {
  return (
    <div className='catalog__search'>
      <input
        value={searchKeyword}
        onChange={async (event) => {
          setSearchKeyword(event.target.value);
          setIsFiltered(!!event.target.value);
        }}
        type='text'
        className='catalog__search__input'
      />
    </div>
  );
};

export default SearchCatalog;
