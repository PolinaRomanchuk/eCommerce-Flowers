import { useEffect, useRef, useState, type ReactElement } from 'react';
import Header, { type HeaderProps } from '../Header/Header';
export type ProductProps = HeaderProps & {};
import '../Product/product.scss';
import { Swiper, type SwiperClass, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Modal from '../../utils/modal/modal';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../../services/product/product';
import {
  addProductToCart,
  checkIfCartExists,
  createNewCart,
  getCart,
  removeProduct,
} from '../../services/cart/cart';
import type { ProductInfo } from '../../types/product';
import type { CartInfo } from '../../types/cart';
import Footer from '../Footer/Footer';
import ShopNavigation from '../Catalog/ShopNavigation';
import { fetchCategoryOrSubcategory } from '../../services/categories/categories';

import Spinner from '../../assets/spinner.gif';

export const Product = ({ size }: ProductProps): ReactElement => {
  const { id } = useParams<{ id: string }>();

  const swiperReference = useRef<SwiperClass | null>(null);
  const swiperLargeReference = useRef<SwiperClass | null>(null);
  const [modalActive, setModalActive] = useState(false);
  const [largePhotoIndex, setLargePhotoIndex] = useState(0);

  const [priceWithDiscount, setPriceWithDiscount] = useState('');
  const [procent, setProcent] = useState('');
  const navigate = useNavigate();

  const [productData, setProductData] = useState<ProductInfo>();
  const [isInCart, setIsInCart] = useState(false);
  const [isExistCart, setIsExistCart] = useState(false);
  const [cart, setCart] = useState<CartInfo>();
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  useEffect(() => {
    (async function fetchProduct(): Promise<void> {
      if (id) {
        const { data, error } = await getProductById(id);

        if (error) {
          navigate('*');
          return;
        }

        if (data) {
          const suborcat = await fetchCategoryOrSubcategory(
            data.categories[0].id,
          );

          if (suborcat === 'category') {
            setCategory(data.categories[0].id);
            setSubcategory(data.categories[1].id);
          } else {
            setCategory(data.categories[1].id);
            setSubcategory(data.categories[0].id);
          }
          setProductData(data);
          if (data.priceWithDiscount && data.discountProcent) {
            setPriceWithDiscount(data.priceWithDiscount);
            setProcent(data.discountProcent);
          }
          const cartInfo = await fetchCartIfExists();
          if (cartInfo) {
            const isInCart = cartInfo.lineItems?.some(
              (item) => item.productId === data.id,
            );
            setIsInCart(!!isInCart);
          }
        }
      }
    })();
  }, []);

  const fetchCartIfExists = async (): Promise<CartInfo | undefined> => {
    const isExists = (await checkIfCartExists()).success;
    if (!isExists) {
      return;
    }
    setIsExistCart(true);
    const cartResult = await getCart();
    setCart(cartResult.data);
    return cartResult.data;
  };

  async function addToCartHandler(): Promise<void> {
    const existingCart = await fetchCartIfExists();

    if (existingCart && productData) {
      const isAlreadyInCart = checkIfCurrentProductInCart(existingCart);

      if (isAlreadyInCart) {
        return;
      }
      await addProductToCart(
        existingCart.id,
        existingCart.version,
        productData.id,
      );
      const updatedCart = await getCart();
      setCart(updatedCart.data);
      setIsInCart(true);
      setIsExistCart(true);
    } else {
      const newCartData = await createNewCart();
      if (newCartData.data && productData) {
        await addProductToCart(
          newCartData.data.id,
          newCartData.data.version,
          productData.id,
        );
        const updatedCart = await getCart();
        setCart(updatedCart.data);
        setIsInCart(true);
        setIsExistCart(true);
      }
    }
  }

  function checkIfCurrentProductInCart(cart: CartInfo | undefined): boolean {
    if (cart && productData) {
      return cart.lineItems?.some((item) => item.productId === productData?.id);
    }
    return false;
  }

  async function removeFromCartHandler(): Promise<void> {
    const cart = await fetchCartIfExists();
    if (cart && productData) {
      const lineItemId = cart.lineItems.find(
        (item) => item.productId === productData.id,
      )?.id;
      if (lineItemId) {
        await removeProduct(cart?.id, cart?.version, lineItemId);
        const updatedCart = await getCart();
        setCart(updatedCart.data);
        setIsInCart(false);
      }
    }
  }

  return (
    <>
      {isExistCart ? (
        <Header size={size} newCounter={cart?.totalLineItemQuantity}></Header>
      ) : (
        <Header size={size}></Header>
      )}
      <ShopNavigation
        category={category}
        subcategory={subcategory}
        productName={productData?.name.toLocaleLowerCase()}
        setCategory={setCategory}
        setSubcategory={setSubcategory}
      />
      {!productData && (
        <div className='product__spinner'>
          {' '}
          <div className='product__spinner-img'>
            <img src={Spinner} alt='spinner' />
          </div>
        </div>
      )}

      {productData && (
        <div className='product'>
          <div className='_container'>
            <div className='product__content'>
              <div className='product__photos'>
                <div className='product__photos-previews'>
                  {productData?.imageUrls?.map((img, index) => (
                    <div
                      key={index}
                      className='product__photos-preview'
                      onClick={() => swiperReference.current?.slideTo(index)}
                    >
                      <img src={img} alt='photo' />
                    </div>
                  ))}
                </div>
                <Swiper
                  rewind={true}
                  navigation={true}
                  modules={[Navigation]}
                  onSwiper={(swiper) => (swiperReference.current = swiper)}
                  className='product__photos-current-picture'
                >
                  {productData?.imageUrls?.map((img, index) => (
                    <SwiperSlide
                      key={index}
                      onClick={() => {
                        setLargePhotoIndex(index);
                        setModalActive(true);
                      }}
                    >
                      <img src={img} alt='photo' />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className='product__info'>
                <div className='product__name'>
                  <h2>{productData.name}</h2>
                </div>

                {priceWithDiscount && (
                  <div className='product__discount'>
                    <div className='product__old-price'>
                      <p className='extra-light'>
                        {priceWithDiscount ? `${productData.price} $` : ''}
                      </p>
                    </div>
                    <div className='product__discount-value'>{procent}</div>
                  </div>
                )}
                <div className='product__price'>
                  <h2>
                    {priceWithDiscount
                      ? `${priceWithDiscount} $`
                      : `${productData.price} $`}
                  </h2>
                </div>
                <div className='product__description'>
                  <p className='extra-light'>{productData.description}</p>
                </div>

                <div className='product__details'>
                  <p className='medium'>Product information:</p>
                  <div className='product__attributes'>
                    <div className='product__attribute'>
                      <p className='regular'> Color: </p>
                      <p className='regular'>{productData.colorAttribute}</p>
                    </div>
                    {productData.occasionAttribute && (
                      <div className='product__attribute'>
                        <p className='regular'> Occasion: </p>
                        <p className='regular'>
                          {productData.occasionAttribute}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className='product__cart'>
                  <button
                    className='product__cart-button'
                    onClick={
                      isInCart ? removeFromCartHandler : addToCartHandler
                    }
                  >
                    {isInCart ? 'Remove from cart' : 'Add to cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {modalActive && (
        <Modal active={modalActive} setActive={setModalActive}>
          <Swiper
            direction={'vertical'}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            onSwiper={(swiper) => {
              swiperLargeReference.current = swiper;
              swiper.slideTo(largePhotoIndex);
            }}
            className='product__modal-swiper'
          >
            {productData?.imageUrls?.map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img} alt='photo' />
              </SwiperSlide>
            ))}
          </Swiper>
        </Modal>
      )}
    </>
  );
};
export default Product;
