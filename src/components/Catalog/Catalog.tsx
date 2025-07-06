import { useEffect, useState, type ReactElement } from 'react';
import Header, { type HeaderProps } from '../Header/Header';
import type { Product } from '../../types/catalog';
import type { Category } from '../../types/categories';
import {
  fetchAllProducts,
  fetchFilteredProducts,
} from '../../services/catalog/catalog';
import './catalog.scss';
import FilterAttributes from './FilterAttributes';
import Sort from './Sort';
import Search from './Search';
import FilterCategory from './FilterCategory';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  addProductToCart,
  checkIfCartExists,
  createNewCart,
  getCart,
  removeProduct,
} from '../../services/cart/cart';
import type { CartInfo } from '../../types/cart';
import Spinner from '../../assets/spinner.gif';
import Footer from '../Footer/Footer';
import ShopNavigation from './ShopNavigation';

import { ReactComponent as FiltersIcon } from './../../assets/Catalog/settings-sliders.svg';
import { ReactComponent as SearchIcon } from './../../assets/Catalog/search.svg';

import { ReactComponent as Left } from './../../assets/Catalog/angle-small-left.svg';
import { ReactComponent as Right } from './../../assets/Catalog/angle-small-right.svg';

import { ReactComponent as BagPlus } from './../../assets/Catalog/shopping-bag-add.svg';
import { ReactComponent as BagMinus } from './../../assets/Catalog/bag-shopping-minus.svg';
import { ReactComponent as Eye } from './../../assets/Catalog/eye-icon.svg';
import { fetchCategoryName } from '../../services/categories/categories';

export type CatalogProps = HeaderProps & {};

export const Catalog = ({ size }: CatalogProps): ReactElement => {
  const [products, setProducts] = useState<Product[]>([]);
  let [filterAttributes, setFilterAttributes] = useState({
    color: '',
    occasion: '',
    price: '',
    type: '',
  });
  let [sortAttributes, setSortAttributes] = useState('');
  let [searchKeyword, setSearchKeyword] = useState('');
  let [category, setCategory] = useState('');
  let [subcategory, setSubcategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [allSubcategories, setAllSubcategories] = useState<Category[]>();
  const [isFiltered, setIsFiltered] = useState(false);
  const [isCategorized, setIsCategorized] = useState(true);

  let [cart, setCart] = useState<CartInfo>();
  let [isExistCart, setIsExistCart] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 6;

  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const [isShowFilters, setIsShowFilters] = useState(
    () => window.innerWidth > 600,
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async function loadProducts(): Promise<void> {
      const categoryFromState = location.state?.categoryId ?? null;
      const subcategoryFromState = location.state?.subcategoryId ?? null;
      const typeFromState = location.state?.typeId ?? null;
      if (typeFromState && filterAttributes.type !== typeFromState) {
        setFilterAttributes((previous) => ({
          ...previous,
          type: typeFromState,
        }));
        setIsFiltered(true);
      }

      if (categoryFromState === '' && category !== '') {
        setCategory('');
        setIsCategorized(false);
      }

      if (subcategoryFromState === '' && subcategory !== '') {
        setSubcategory('');
      }

      if (categoryFromState && !category && !subcategory) {
        setCategory(categoryFromState);
        setIsCategorized(true);
      }

      if (subcategoryFromState && !subcategory) {
        setSubcategory(subcategoryFromState);
        setIsCategorized(true);
      }

      if (isCategorized || isFiltered) {
        const { products, total } = await fetchFilteredProducts(
          {
            ...filterAttributes,
            categoryId: subcategory || category || undefined,
          },
          sortAttributes,
          searchKeyword,
          currentPage,
        );
        setProducts(products);
        setTotalProducts(total);
        if (category) {
          const categoryname = (
            await fetchCategoryName(category)
          ).toLowerCase();
          setCategoryName(categoryname);
        }
      } else {
        const result = await fetchAllProducts(currentPage);
        setProducts(result.products);
        setTotalProducts(result.total);
      }
    })();

    (async function checkCart(): Promise<void> {
      setIsExistCart((await checkIfCartExists()).success);

      if (isExistCart) {
        const cartResult = (await getCart()).data;
        if (cartResult) {
          setCart(cartResult);
        }
      }
    })();
  }, [
    currentPage,
    isExistCart,
    isFiltered,
    sortAttributes,
    category,
    subcategory,
    isCategorized,
    filterAttributes,
    searchKeyword,
    location.state?.categoryId,
    location.state?.subcategoryId,
    location.state?.typeId,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterAttributes, sortAttributes, category, subcategory, searchKeyword]);

  useEffect(() => {
    if (size <= 550) {
      setIsShowFilters(false);
    } else {
      setIsShowFilters(true);
    }
  }, [size]);

  function checkIfProductInCart(
    currproductId: string,
    currentVariantId: number,
  ): boolean {
    if (cart) {
      return cart.lineItems?.some(
        (item) =>
          item.productId === currproductId &&
          item.variant.id === currentVariantId,
      );
    }
    return false;
  }

  const handleClick = (id: string): void => {
    navigate(`/product/${id}`);
  };

  async function handleAddToCart(
    productId: string,
    productVariant: number,
  ): Promise<void> {
    setLoadingProductId(productId);

    try {
      if (cart) {
        await addProductToCart(
          cart.id,
          cart.version,
          productId,
          productVariant,
        );
      } else {
        const newCartData = await createNewCart();
        if (newCartData.data) {
          await addProductToCart(
            newCartData.data.id,
            newCartData.data.version,
            productId,
            productVariant,
          );
        }
      }
      const updatedCart = (await getCart()).data;
      if (updatedCart) {
        setCart(updatedCart);
        setIsExistCart(true);
      }
    } finally {
      setLoadingProductId(null);
    }
  }

  async function handleRemoveFromCart(
    productId: string,
    productVariantId: number,
  ): Promise<void> {
    setLoadingProductId(productId);
    try {
      if (cart) {
        const lineItemId = cart.lineItems.find(
          (item) =>
            item.productId === productId &&
            item.variant.id === productVariantId,
        )?.id;
        if (lineItemId) {
          await removeProduct(cart?.id, cart?.version, lineItemId);
        }
        const updatedCart = (await getCart()).data;
        if (updatedCart) {
          setCart(updatedCart);
        }
      }
    } finally {
      setLoadingProductId(null);
    }
  }

  let cards = products.map((item, index) => {
    return (
      <div
        onClick={() => handleClick(item.id)}
        key={index}
        className='catalog__card'
      >
        <div className='catalog__card__img'>
          <img src={item.image} alt='' />
          {item.discountedPrice && (
            <div className='catalog__card__sale-tag'>
              <span>sale</span>
            </div>
          )}

          <div
            className={
              size < 1000
                ? 'catalog__card__cart-controls catalog__card__cart-controls--mobile'
                : 'catalog__card__cart-controls'
            }
          >
            <Eye />
            <span className='catalog__card__separator' />
            {checkIfProductInCart(item.id, item.masterVariantId) ? (
              <button
                className='catalog__card__cart-button catalog__card__cart-button--added'
                onClick={(event) => {
                  event.stopPropagation();
                  if (item.masterVariantId) {
                    handleRemoveFromCart(item.id, item.masterVariantId);
                  }
                }}
                disabled={loadingProductId === item.id}
              >
                {loadingProductId === item.id ? (
                  <img src={Spinner} alt='spinner' />
                ) : (
                  <BagMinus />
                )}
              </button>
            ) : (
              <button
                className='catalog__card__cart-button'
                onClick={(event) => {
                  event.stopPropagation();
                  if (item.masterVariantId) {
                    handleAddToCart(item.id, item.masterVariantId);
                  }
                }}
                disabled={loadingProductId === item.id}
              >
                {loadingProductId === item.id ? (
                  <img src={Spinner} alt='spinner' />
                ) : (
                  <BagPlus />
                )}
              </button>
            )}
          </div>
        </div>
        <div className='catalog__card__name'>
          <p className='regular'>{item.name}</p>
        </div>
        <div className='catalog__card__price'>
          <div
            className={`catalog__card__price__original ${item.discountedPrice ? 'shadow' : ''}`}
          >
            <p className='extra-light'> {item.prices}$</p>
          </div>
          {item.discountedPrice && (
            <div className='catalog__card__price__discount'>
              <p className='medium'> {item.discountedPrice}$</p>
            </div>
          )}
        </div>
        <div className='catalog__card__description'>
          <p className='extra-light'>{item.description}</p>
        </div>
      </div>
    );
  });

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  return (
    <>
      {isExistCart ? (
        <Header size={size} newCounter={cart?.lineItems.length} />
      ) : (
        <Header size={size} />
      )}
      <ShopNavigation
        category={category}
        subcategory={subcategory}
        setCategory={setCategory}
        setSubcategory={setSubcategory}
      />
      <section className='catalog'>
        <div className='_container'>
          <div
            className={
              isShowFilters
                ? 'catalog__content'
                : 'catalog__content catalog__content--six'
            }
          >
            <div className='catalog__controls'>
              <div className='catalog__filters-header'>
                <button
                  onClick={() => {
                    setIsShowFilters((previous) => !previous);
                  }}
                >
                  <span>
                    <FiltersIcon className='catalog-icon' />
                    <p>{isShowFilters ? 'hide filters' : 'show filters'}</p>
                  </span>
                </button>
                <div className='catalog__search-container'>
                  <Search
                    searchKeyword={searchKeyword}
                    setSearchKeyword={setSearchKeyword}
                    setIsFiltered={setIsFiltered}
                  />
                  <div className='catalog__search-icon-container'>
                    <SearchIcon className='catalog-icon' />
                  </div>
                </div>
              </div>

              <Sort
                sortAttributes={sortAttributes}
                setSortAttributes={setSortAttributes}
                setIsFiltered={setIsFiltered}
              />
            </div>

            {category && (
              <div className='catalog__subcategories'>
                <h3>{categoryName}</h3>
                <div className='catalog__subcategories-list'>
                  {allSubcategories?.map((subcat) => (
                    <p
                      className='extra-light catalog__subcategories-item'
                      key={subcat.id}
                      onClick={() => {
                        setSubcategory(subcat.id);
                        setIsCategorized(true);
                      }}
                    >
                      {subcat.name['en-US'].toLowerCase()}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div
              className={
                isShowFilters
                  ? 'catalog__layout'
                  : 'catalog__layout catalog__layout--six'
              }
            >
              {isShowFilters && (
                <div
                  className={
                    size <= 640
                      ? 'catalog__filters-overlay--active'
                      : 'catalog__filters-overlay'
                  }
                >
                  <div className='catalog__filters-container'>
                    {size <= 640 && (
                      <div className='catalog__filters-container-button'>
                        <button
                          className='icon'
                          onClick={() => setIsShowFilters(false)}
                        >
                          x
                        </button>
                      </div>
                    )}
                    <FilterAttributes
                      filterAttributes={filterAttributes}
                      setFilterAttributes={setFilterAttributes}
                      setIsFiltered={setIsFiltered}
                    />
                    <FilterCategory
                      category={category}
                      setCategory={setCategory}
                      subcategory={subcategory}
                      setSubcategory={setSubcategory}
                      setIsCategoried={setIsCategorized}
                      allSubcategories={allSubcategories}
                      setAllSubcategories={setAllSubcategories}
                    />
                  </div>
                </div>
              )}

              {cards.length > 0 ? (
                <div
                  className={
                    isShowFilters
                      ? 'catalog__cards-wrapper'
                      : 'catalog__cards-wrapper catalog__cards-wrapper--six'
                  }
                >
                  <div
                    className={
                      isShowFilters
                        ? 'catalog__grid'
                        : 'catalog__grid catalog__grid--six'
                    }
                  >
                    {cards}
                  </div>
                </div>
              ) : (
                <div className='catalog__no-products'>
                  <p className='extra-light'>
                    There are no products according to the specified filters,
                    try other search parameters
                  </p>
                </div>
              )}
            </div>
            <div className='catalog__pagination'>
              <button
                className='catalog__pagination-button'
                onClick={() =>
                  setCurrentPage((previous) => Math.max(previous - 1, 1))
                }
                disabled={currentPage === 1}
              >
                <Left />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={
                      page === currentPage
                        ? 'catalog__pagination-page catalog__pagination-page--active'
                        : 'catalog__pagination-page'
                    }
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                className='catalog__pagination-button'
                onClick={() =>
                  setCurrentPage((previous) =>
                    Math.min(previous + 1, totalPages),
                  )
                }
                disabled={currentPage === totalPages}
              >
                <Right />
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Catalog;
