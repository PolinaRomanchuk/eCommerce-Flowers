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

export const Product = ({ size }: ProductProps): ReactElement => {
  const { id } = useParams<{ id: string }>();

  const swiperReference = useRef<SwiperClass | null>(null);
  const swiperLargeReference = useRef<SwiperClass | null>(null);
  const [modalActive, setModalActive] = useState(false);
  const [largePhotoIndex, setLargePhotoIndex] = useState(0);
  const [selectedClothingSize, setSelectedClothingSize] = useState('S');

  const [price, setPrice] = useState('');
  const [priceWithDiscount, setPriceWithDiscount] = useState('');
  const [procent, setProcent] = useState('');
  const [currency, setCurrency] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [color, setColor] = useState('');
  const [model, setModel] = useState('');
  const [clothingSizes, setClothingSizes] = useState<string[]>([]);
  const [currentVariantId, setCurrentVariantId] = useState(0);
  const navigate = useNavigate();

  const [productData, setProductData] = useState<ProductInfo>();
  const [isInCart, setIsInCart] = useState(false);
  let [isExistCart, setIsExistCart] = useState(false);
  const [cart, setCart] = useState<CartInfo>();

  useEffect(() => {
    async function fetchProduct(): Promise<void> {
      if (id) {
        const productData = await getProductById(id);

        if (productData.error) {
          navigate('*');
          return;
        }

        if (productData && productData.data) {
          setProductData(productData.data);

          setPrice(productData.data?.price);
          setCurrency(
            productData.data.currency === 'USD'
              ? '$'
              : productData.data.currency,
          );

          if (productData.data.imageUrls) {
            setImages(productData.data?.imageUrls);
          }
          setClothingSizes(productData.data?.sizes);
          if (
            productData.data.priceWithDiscount &&
            productData.data.discountProcent
          ) {
            setPriceWithDiscount(productData.data.priceWithDiscount);
            setProcent(productData.data.discountProcent);
          }
          if (productData.data.colorAttribute) {
            setColor(productData.data.colorAttribute);
          }
          if (productData.data.modelAttribute) {
            setModel(productData.data.modelAttribute);
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

  function handleVariant(size: string): void {
    const masterSize = productData?.masterVariant.attributes?.find(
      (x) => x.name === 'size',
    )?.value;
    if (typeof masterSize === 'object') {
      if (productData?.masterVariant) {
        masterSize.label === size
          ? setCurrentVariantId(productData?.masterVariant.id)
          : '';
      }
    }

    productData?.variants.map((x) => {
      const variantsize = x.attributes.find((y) => y.name === 'size')?.value;
      if (typeof variantsize === 'object') {
        if (productData?.variants) {
          variantsize.label === size ? setCurrentVariantId(x.id) : '';
        }
      }
    });
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
      <div className='product-container'>
        <div className='product-content'>
          <div className='product-photo-container'>
            <div className='product-pictures-container'>
              {images.map((img, index) => (
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
              {images.map((img, index) => (
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
              {productData ? productData.name : ''}
            </div>
            <div className='product-description'>
              {productData ? productData.description : ''}
            </div>
            {priceWithDiscount && (
              <div className='product-discount-container'>
                <div className='product-old-price'>
                  {' '}
                  {priceWithDiscount ? `${price} ${currency}` : ''}
                </div>
                <div className='product-discount'>{procent}</div>
              </div>
            )}
            <div className='product-full-price'>
              {priceWithDiscount
                ? `${priceWithDiscount} ${currency}`
                : `${price} ${currency}`}
            </div>
            {color && (
              <div className='product-color-container'>
                <span className='product-color'> Color:</span>
                <span className='product-current-color'>{color}</span>
              </div>
            )}
            {model && (
              <div className='product-model-container'>
                <span className='product-model'> Model:</span>
                <span className='product-current-model'>{model}</span>
              </div>
            )}

            <div className='product-size'> Size: </div>
            <div className='size-options'>
              {clothingSizes.map((clothSize) => (
                <label
                  key={clothSize}
                  className={`size-option-button ${selectedClothingSize === clothSize ? 'active' : ''}`}
                >
                  <input
                    type='radio'
                    name='clothSize'
                    value={clothSize}
                    checked={selectedClothingSize === clothSize}
                    onChange={() => {
                      setSelectedClothingSize(clothSize);
                      handleVariant(clothSize);
                    }}
                    className='size-radio'
                  ></input>
                  {clothSize}
                </label>
              ))}
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
            {images.map((img, index) => (
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
