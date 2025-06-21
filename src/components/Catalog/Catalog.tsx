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
        </div>
        <div className='catalog__card__name'>{item.name}</div>
        <div className='catalog__card__price'>
          <div className='catalog__card__price__title'>Price:</div>
          <div className='catalog__card__price__amount'>
            <div
              className={`catalog__card__price__amount__original ${item.discountedPrice ? 'shadow' : ''}`}
            >
              {item.prices}
            </div>
            {item.discountedPrice ? (
              <div className='catalog__card__price__amount__discount'>
                {item.discountedPrice}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className='catalog__card__description'>{item.description}</div>

        <div className='add-to-cart-button-container'>
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
                <img src={Remove} alt='remove from cart' />
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
                <img src={Add} alt='add to cart' />
              )}
            </button>
          )}
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
      <section className='catalog'>
        <div className='_container'>
          {category.length <= 0 ? (
            <>
              <FilterCatalog
                filterAttributes={filterAttributes}
                setFilterAttributes={setFilterAttributes}
                token={token}
                setProducts={setProducts}
              />
              <SortCatalog
                sortAttributes={sortAttributes}
                setSortAttributes={setSortAttributes}
                token={token}
                setProducts={setProducts}
                filterAttributes={filterAttributes}
                search={search}
              />
              <SearchCatalog
                search={search}
                setSearch={setSearch}
                token={token}
                setProducts={setProducts}
                filterAttributes={filterAttributes}
                sortAttributes={sortAttributes}
              />
              <button
                onClick={loadFilteredProducts}
                className='catalog__filter__search'
              >
                search
              </button>
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
          <div className='catalog__cards'>{cards}</div>

          <div className='pagination-container'>
            <button
              onClick={() =>
                setCurrentPage((previous) => Math.max(previous - 1, 1))
              }
              disabled={currentPage === 1}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? 'active-page' : ''}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((previous) => Math.min(previous + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Catalog;
