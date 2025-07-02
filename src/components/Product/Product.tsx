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

export const Product = ({ size }: ProductProps): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const swiperReference = useRef<SwiperClass | null>(null);
  const swiperLargeReference = useRef<SwiperClass | null>(null);
  const [modalActive, setModalActive] = useState(false);
  const [largePhotoIndex, setLargePhotoIndex] = useState(0);

  const [priceWithDiscount, setPriceWithDiscount] = useState('');
  const [procent, setProcent] = useState('');
  const [currency, setCurrency] = useState('');
  const [currentVariantId, setCurrentVariantId] = useState(0);
  const navigate = useNavigate();

  const [productData, setProductData] = useState<ProductInfo>();
  const [isInCart, setIsInCart] = useState(false);
  let [isExistCart, setIsExistCart] = useState(false);
  const [cart, setCart] = useState<CartInfo>();
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  const [isCategorized, setIsCategorized] = useState(true);

  useEffect(() => {
    async function fetchProduct(): Promise<void> {
      if (id) {
        const productData = await getProductById(id);

        const cat = productData.data?.categories[0].id;
        const subcategory = productData.data?.categories[1].id;

        if (cat && subcategory) {
          const suborcat = await fetchCategoryOrSubcategory(cat);

          if (suborcat === 'category') {
            setCategory(cat);
            setSubcategory(subcategory);
          } else {
            setCategory(subcategory);
            setSubcategory(cat);
          }
        }

        if (productData.error) {
          navigate('*');
          return;
        }

        if (productData && productData.data) {
          setProductData(productData.data);

          setCurrency(
            productData.data.currency === 'USD'
              ? '$'
              : productData.data.currency,
          );

          if (
            productData.data.priceWithDiscount &&
            productData.data.discountProcent
          ) {
            setPriceWithDiscount(productData.data.priceWithDiscount);
            setProcent(productData.data.discountProcent);
          }

          setCurrentVariantId(productData.data.masterVariant.id);
        }
      }
    }
    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    checkCartAndSetProductStatus();
  }, [currentVariantId]);

  async function checkCartAndSetProductStatus(): Promise<void> {
    const cartInfo = await getExistingCart();
    if (cartInfo) {
      const isInCart = checkIfCurrentProductInCart(cartInfo);
      if (isInCart) {
        setIsInCart(true);
      } else {
        setIsInCart(false);
      }
    }
  }

  const getExistingCart = async (): Promise<CartInfo | undefined> => {
    const isExists = (await checkIfCartExists()).success;
    if (!isExists) {
      return;
    }
    setIsExistCart(true);
    const cartResult = await getCart();
    setCart(cartResult.data);
    return cartResult.data;
  };

  async function handleAddToCart(): Promise<void> {
    const existingCart = await getExistingCart();

    if (existingCart && productData) {
      const isAlreadyInCart = checkIfCurrentProductInCart(existingCart);

      if (isAlreadyInCart) {
        return;
      }
      await addProductToCart(
        existingCart.id,
        existingCart.version,
        productData.id,
        currentVariantId,
      );
      setIsInCart(true);
    } else {
      const newCartData = await createNewCart();
      if (newCartData.data && productData) {
        await addProductToCart(
          newCartData.data.id,
          newCartData.data.version,
          productData.id,
          currentVariantId,
        );
        setIsInCart(true);
      }
    }
  }

  function checkIfCurrentProductInCart(cart: CartInfo | undefined): boolean {
    if (cart) {
      return cart.lineItems?.some(
        (item) =>
          item.productId === productData?.id &&
          item.variant.id === currentVariantId,
      );
    }
    return false;
  }

  async function handleRemoveFromCart(): Promise<void> {
    const cart = await getExistingCart();
    if (cart && productData) {
      const lineItemId = cart.lineItems.find(
        (item) =>
          item.productId === productData.id &&
          item.variant.id === currentVariantId,
      )?.id;
      if (lineItemId) {
        await removeProduct(cart?.id, cart?.version, lineItemId);
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
      {productData && (
        <div className='product-container'>
          <div className='_container'>
            <div className='product-content'>
              <div className='product-photo-container'>
                <div className='product-pictures-container'>
                  {productData?.imageUrls?.map((img, index) => (
                    <div
                      key={index}
                      className='product-picture-container'
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
                  className='product-current-photo-container'
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
              <div className='product-info-container'>
                <div className='product-name'>
                  <h2>{productData.name}</h2>
                </div>

                {priceWithDiscount && (
                  <div className='product-discount-container'>
                    <div className='product-old-price'>
                      <p className='extra-light'>
                        {priceWithDiscount
                          ? `${productData.price} ${currency}`
                          : ''}
                      </p>
                    </div>
                    <div className='product-discount'>{procent}</div>
                  </div>
                )}
                <div className='product-full-price'>
                  <h2>
                    {priceWithDiscount
                      ? `${priceWithDiscount} ${currency}`
                      : `${productData.price} ${currency}`}
                  </h2>
                </div>
                <div className='product-description'>
                  <p className='extra-light'>{productData.description}</p>
                </div>

                <div className='extra-description'>
                  <h3>Product information:</h3>
                  <div className='product-attributes-container'>
                    <div className='product-attribute-container'>
                      <p className='extra-light'> Color: </p>
                      <p className='extra-light'>
                        {productData.colorAttribute}
                      </p>
                    </div>
                    {productData.occasionAttribute && (
                      <div className='product-attribute-container'>
                        <p className='extra-light'> Occasion: </p>
                        <p className='extra-light'>
                          {productData.occasionAttribute}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className='cart-configs-container'>
                  {!isInCart ? (
                    <button
                      className='add-to-cart-button'
                      onClick={handleAddToCart}
                    >
                      Add to cart
                    </button>
                  ) : (
                    <button
                      className='add-to-cart-button'
                      onClick={handleRemoveFromCart}
                    >
                      Remove from cart
                    </button>
                  )}
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
            className='large-photo-container'
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
