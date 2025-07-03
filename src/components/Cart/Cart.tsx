import { useEffect, useState, type ReactElement } from 'react';
import Header, { type HeaderProps } from '../Header/Header';
export type CartProps = HeaderProps & {};
import './cart.scss';
import EmptyCart from '../Cart/EmptyCart';
import ProductCard from './ProductCard';
import {
  addPromo,
  getCart,
  removeCart,
  removePromo,
} from '../../services/cart/cart';
import { type CartInfo, type DiscountCode, type Item } from '../../types/cart';
import { formatAttribute, getFormatPrice } from '../../utils/format-attributes';
import Modal from '../../utils/modal/modal';
import Footer from '../Footer/Footer';
export const Cart = ({ size }: CartProps): ReactElement => {
  const [cartIsEmpty, setCartIsEmpty] = useState(true);
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [totalCartPrice, setTotalCartPrice] = useState('');
  const [fullPrice, setFullPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [cartVersion, setCartVersion] = useState(0);
  const [cartId, setCartId] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [promoName, setPromoName] = useState('');

  const [promoError, setPromoError] = useState('');
  const [promoData, setPromodata] = useState<DiscountCode[]>();
  const [modalActive, setModalActive] = useState(false);
  const [cart, setCart] = useState<CartInfo>();
  const [modalContent, setModalContent] = useState<
    'delete-cart' | 'modal-message' | null
  >(null);

  const openModal = (type: 'delete-cart' | 'modal-message'): void => {
    setModalContent(type);
    setModalActive(true);
  };

  useEffect(() => {
    async function fetchCart(): Promise<void> {
      const result = await getCart();
      if (result.data) {
        if (result.data?.lineItems.length === 0) {
          setCartIsEmpty(true);
          return;
        }
        setCartIsEmpty(false);
        setCartItems(result.data?.lineItems);
        setTotalCartPrice(getFormatPrice(result.data.totalPrice.centAmount));
        setCartVersion(result.data.version);
        setCartId(result.data.id);
        setCart(result.data);

        if (result.data.discountOnTotalPrice) {
          const discountAmount =
            result.data.discountOnTotalPrice.discountedAmount.centAmount;
          const total = result.data.totalPrice.centAmount;
          const oldTotal = discountAmount + total;

          setDiscount(getFormatPrice(discountAmount));
          setFullPrice(getFormatPrice(oldTotal));
          setPromodata(result.data.discountCodes);
          const cachedPromoName = localStorage.getItem('promo-code-name');
          if (cachedPromoName) {
            setPromoName(cachedPromoName);
          } else {
            setPromoName('');
            localStorage.removeItem('promo-code-name');
            setDiscount('');
            await handleRemovePromo();
          }
        }
      }
      if (result.error) {
        setCartIsEmpty(true);
      }
    }
    fetchCart();
  }, [cartVersion]);

  useEffect(() => {
    setCartItems([]);
    setCart(undefined);
  }, [cartIsEmpty]);

  const handleRemoveCart = async (): Promise<void> => {
    setModalActive(false);
    const data = await removeCart(cartId, cartVersion);
    if (data.data) {
      setCartVersion(data.data.version);
      setCartIsEmpty(true);
      setCartItems([]);
      setCart(undefined);
      localStorage.removeItem('promo-code-name');
    }
  };

  const handleAddPromo = async (): Promise<void> => {
    const data = await addPromo(cartId, cartVersion, promoInput);
    if (data.data) {
      setCartVersion(data.data.version);
      setPromoName(promoInput);
      localStorage.setItem('promo-code-name', promoInput);
      setPromoInput('');
      setPromoError('');
    }
    if (data.error) {
      setPromoError('This promo does not exist');
    }
  };

  const handleRemovePromo = async (): Promise<void> => {
    if (promoData) {
      const data = await removePromo(
        cartId,
        cartVersion,
        promoData[0].discountCode.typeId,
        promoData[0].discountCode.id,
      );
      if (data.data) {
        setCartVersion(data.data.version);
        setPromoName('');
        setDiscount('');
        localStorage.removeItem('promo-code-name');
      }
    }
  };

  async function handlePlaceOrder(): Promise<void> {
    openModal('modal-message');
    const data = await removeCart(cartId, cartVersion);
    if (data.data) {
      setCartVersion(data.data.version);
      setCartIsEmpty(true);
      setCartItems([]);
      setCart(undefined);
      localStorage.removeItem('promo-code-name');
    }
  }

  return (
    <>
      <Header size={size} newCounter={cart?.totalLineItemQuantity} />
      <div className='cart-container'>
        <div className='_container'>
          <div className='cart-content'>
            {cartIsEmpty ? (
              <EmptyCart />
            ) : (
              <>
                <h2 className='cart-header'>My cart</h2>
                <div className='products-container'>
                  <div className='product-card-list'>
                    {cartItems.length > 0 &&
                      cartItems.map((item) => (
                        <ProductCard
                          key={item.id}
                          img={item.variant.images[0].url}
                          name={item.name['en-US']}
                          price={getFormatPrice(item.price.value.centAmount)}
                          discountedPrice={getFormatPrice(
                            item.price.discounted?.value.centAmount,
                          )}
                          quantity={item.quantity}
                          color={formatAttribute(
                            item.variant.attributes,
                            'color',
                          )}
                          version={cartVersion}
                          setCartVersion={setCartVersion}
                          productId={item.id}
                          cartId={cartId}
                        />
                      ))}
                  </div>
                  <div className='price-container'>
                    <div className='full-price-container'>
                      <h3 className='total-message'>Total price</h3>
                      {discount ? (
                        <>
                          <div className='discount-container'>
                            <div className='old-price'>{fullPrice}$</div>
                            <div className='promo-tag-container'>
                              <div className='promo-name'>{promoName}</div>
                              <button
                                className='remove-promo-button icon'
                                onClick={handleRemovePromo}
                              >
                                x
                              </button>
                            </div>
                          </div>

                          <div className='total-price'>{totalCartPrice}$</div>
                        </>
                      ) : (
                        <div className='total-price'>{totalCartPrice}$</div>
                      )}

                      <button
                        className='place-order-button'
                        onClick={handlePlaceOrder}
                      >
                        <span>Place order</span>
                      </button>
                    </div>

                    {!discount ? (
                      <div className='promo-container'>
                        <h3>Enter promo</h3>
                        <input
                          name='promo'
                          type='text'
                          className='promo-input'
                          value={promoInput}
                          onChange={(event) => {
                            setPromoInput(event.target.value);
                          }}
                        />
                        <span className='valid-promo-error'>{promoError}</span>
                        <button onClick={handleAddPromo}>
                          <span>Apply</span>
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <button
                  className='remove-all-items-button'
                  onClick={() => openModal('delete-cart')}
                >
                  <span>Clear Shopping Cart</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {modalActive && (
        <Modal active={modalActive} setActive={setModalActive}>
          {modalContent === 'delete-cart' && (
            <div className='modal-message-empty-cart-container'>
              <div className='modal-message-empty-cart'>
                Are you sure you want to empty the cart?
              </div>
              <div className='clear-cart-button-container'>
                <button
                  className='clear-cart-button'
                  onClick={handleRemoveCart}
                >
                  <span>Yes</span>
                </button>
              </div>
            </div>
          )}
          {modalContent === 'modal-message' && (
            <div className='-modal-message-container'>
              <div className='modal-message-text'>
                Your order has been accepted
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default Cart;
