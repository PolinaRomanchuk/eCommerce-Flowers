import { useEffect, useState, type ReactElement } from 'react';
import Header, { type HeaderProps } from '../Header/Header';
import type { Product } from '../../types/catalog';
import {
  fetchProducts,
  fetchProductsAttributes,
  getCategories,
} from '../../services/catalog/catalog';
import './catalog.scss';
import FilterCatalog from './FilterCatalog';
import SortCatalog from './SortCatalog';
import SearchCatalog from './SearchCatalog';
import BreadCrumbs from './BreadCrumbs';
import { useNavigate } from 'react-router-dom';

import Add from '../../assets/Catalog/add-to-cart.png';
import Remove from '../../assets/Catalog/remove-from-cart.png';
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
import { ReactComponent as SortIcon } from './../../assets/Catalog/sort-alt.svg';

import { ReactComponent as Left } from './../../assets/Catalog/angle-small-left.svg';
import { ReactComponent as Right } from './../../assets/Catalog/angle-small-right.svg';

import { ReactComponent as BagPlus } from './../../assets/Catalog/shopping-bag-add.svg';
import { ReactComponent as BagMinus } from './../../assets/Catalog/bag-shopping-minus.svg';
import { ReactComponent as Eye } from './../../assets/Catalog/eye-icon.svg';

export type CatalogProps = HeaderProps & {};

export const Catalog = ({ size }: CatalogProps): ReactElement => {
  const [products, setProducts] = useState<Product[]>([]);
  let [filterAttributes, setFilterAttributes] = useState({
    color: '',
    size: '',
    price: '',
    type: '',
  });
  let [sortAttributes, setSortAttributes] = useState('');
  let [search, setSearch] = useState('');
  let [category, setCategory] = useState('');
  let [subcategory, setSubcategory] = useState('');
  let [isExistCart, setIsExistCart] = useState(false);
  let [cart, setCart] = useState<CartInfo>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 6;
  const [isFiltered, setIsFiltered] = useState(false);
  const [isCategoried, setIsCategoried] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  useEffect(() => {
    (async function loadProducts(): Promise<void> {
      if (isCategoried && (category || subcategory)) {
        const { products, total } = await getCategories(
          subcategory || category,
          currentPage,
        );
        setProducts(products);
        setTotalProducts(total);
        setIsFiltered(false);
      } else if (isFiltered) {
        const { products, total } = await fetchProductsAttributes(
          filterAttributes,
          sortAttributes,
          search,
          currentPage,
        );
        setProducts(products);
        setTotalProducts(total);
      } else {
        const result = await fetchProducts(currentPage);
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
    isCategoried,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterAttributes, sortAttributes, category, subcategory]);

  function checkIfCurrentProductInCart(
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

  const navigate = useNavigate();

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

  async function loadFilteredProducts(): Promise<void> {
    if (!token) {
      return;
    }

    try {
      const { products, total } = await fetchProductsAttributes(
        filterAttributes,
        sortAttributes,
        search,
        currentPage,
      );
      setProducts(products);
      setTotalProducts(total);
      setIsFiltered(true);
    } catch (error) {
      void error;
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
          <div className='sale-tag_container'>
            <span>sale</span>
          </div>

          <div className='show-cart_container'>
            <Eye />
            <span className='separator' />
            {checkIfCurrentProductInCart(item.id, item.masterVariantId) ? (
              <button
                className='add-to-cart-button-in-catalog added'
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
                className='add-to-cart-button-in-catalog'
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
            <p className='extra-light'> {item.prices}</p>
          </div>
          {item.discountedPrice && (
            <div className='catalog__card__price__discount'>
              <p className='medium'> {item.discountedPrice}</p>
            </div>
          )}
        </div>
        <div className='catalog__card__description'>
          <p className='extra-light'>{item.description}</p>
        </div>
      </div>
    );
  });
  let token = localStorage.getItem('customer-token');
  if (!token) {
    token = localStorage.getItem('anonymous-token');
  }
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  return (
    <>
      {isExistCart ? (
        <Header size={size} newCounter={cart?.lineItems.length} />
      ) : (
        <Header size={size} />
      )}
      <ShopNavigation />
      <section className='catalog'>
        <div className='_container'>
          {category.length <= 0 ? (
            <>
              <div className='configur_container'>
                <div className='first'>
                  <button>
                    <span>
                      <FiltersIcon className='conf-icon' />
                      hide filters
                    </span>
                  </button>
                  <div className='search-container'>
                    <SearchCatalog
                      search={search}
                      setSearch={setSearch}
                      token={token}
                      setProducts={setProducts}
                      filterAttributes={filterAttributes}
                      sortAttributes={sortAttributes}
                    />
                    <button
                      className='search-button'
                      onClick={loadFilteredProducts}
                    >
                      <SearchIcon className='conf-icon' />
                    </button>
                  </div>
                </div>
                <button>
                  <span>
                    <SortIcon className='conf-icon' />
                    sort
                  </span>
                  <SortCatalog
                    sortAttributes={sortAttributes}
                    setSortAttributes={setSortAttributes}
                    token={token}
                    setProducts={setProducts}
                    filterAttributes={filterAttributes}
                    search={search}
                  />
                </button>
              </div>

              <div className='categories-container'>
                <h3>Current category</h3>
                <div className='sub-categories-list'>
                  <p className='extra-light'>subcategory</p>
                  <p className='extra-light'>subcategory</p>
                  <p className='extra-light'>subcategory</p>
                  <p className='extra-light'>subcategory</p>
                  <p className='extra-light'>subcategory</p>
                </div>
              </div>
            </>
          ) : (
            ''
          )}
          <BreadCrumbs
            category={category}
            setCategory={setCategory}
            setProducts={setProducts}
            subcategory={subcategory}
            setSubcategory={setSubcategory}
            setIsCategoried={setIsCategoried}
          />

          <div className='cards_with_filtres_pagination_container'>
            <FilterCatalog
              filterAttributes={filterAttributes}
              setFilterAttributes={setFilterAttributes}
              token={token}
              setProducts={setProducts}
            />

            <div className='catalog__cards'>{cards}</div>
          </div>
          <div className='pagination-container'>
            <button
              className='pagination-button'
              onClick={() =>
                setCurrentPage((previous) => Math.max(previous - 1, 1))
              }
              disabled={currentPage === 1}
            >
              <Left />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? 'active-page' : 'page'}
              >
                {page}
              </button>
            ))}

            <button
              className='pagination-button'
              onClick={() =>
                setCurrentPage((previous) => Math.min(previous + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <Right />
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Catalog;
