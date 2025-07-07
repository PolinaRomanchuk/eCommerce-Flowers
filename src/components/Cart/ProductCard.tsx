import { useEffect, useState, type ReactElement } from 'react';
import './product-card.scss';
import { removeProduct, updateProductCount } from '../../services/cart/cart';

type ProductCardProps = {
  img: string;
  name: string;
  color?: string;
  price: string;
  discountedPrice?: string;
  quantity: number;
  version: number;
  setCartVersion: React.Dispatch<React.SetStateAction<number>>;
  productId: string;
  cartId: string;
};

export const ProductCard = ({
  img,
  name,
  color,
  price,
  discountedPrice,
  quantity,
  version,
  setCartVersion,
  productId,
  cartId: cartId,
}: ProductCardProps): ReactElement => {
  const [count, setCount] = useState(quantity);
  const [totalPrice, setTotalPrice] = useState(discountedPrice || price);

  useEffect(() => {
    let priceNumber = 0;
    discountedPrice
      ? (priceNumber = Number(discountedPrice))
      : (priceNumber = Number(price));

    const newPrice = priceNumber * count;
    setTotalPrice(newPrice.toFixed(2));
  }, [count, discountedPrice, price]);

  const handleCount = async (operation: string): Promise<void> => {
    let newCount = 0;
    if (operation === 'plus') {
      newCount = count + 1;
    } else if (operation === 'minus') {
      newCount = count - 1;
    }
    const data = await updateProductCount(cartId, version, newCount, productId);
    if (data.data) {
      setCartVersion(data.data.version);
    }
  };

  const handleRemoveProduct = async (): Promise<void> => {
    const data = await removeProduct(cartId, version, productId);
    if (data.data) {
      setCartVersion(data.data.version);
    }
  };

  return (
    <>
      <div className='cart__item'>
        <div className='cart__product-card'>
          <button
            className='cart__product-card__remove-button icon'
            onClick={handleRemoveProduct}
          >
            x
          </button>
          <div className='cart__product-card__image-container'>
            <img
              className='cart__product-card__image-container-image'
              src={img}
              alt='photo'
            />
          </div>
          <div className='cart__product-card__info'>
            <div className='cart__product-card__info-name medium'>{name}</div>
            {color && (
              <div className='cart__product-card__info-color'>
                <p className='extra-light'>Color:</p> {color}
              </div>
            )}
          </div>
          <div className='cart__product-card__price'>
            {discountedPrice ? (
              <>
                <div className='cart__product-card__price-old'>
                  <p className='extra-light'>{price}</p>
                </div>
                <div className='product-card__price-final'>
                  <p className='extra-light'>{discountedPrice}</p>
                </div>
              </>
            ) : (
              <div className='product-card__price-final'>
                <p className='regular'>{price}</p>
              </div>
            )}
          </div>
          <div className='cart__product-card__counter'>
            <button
              className='cart__product-card__counter-button icon'
              onClick={() => {
                if (count > 1) {
                  setCount(count - 1);
                  handleCount('minus');
                }
              }}
            >
              -
            </button>
            <span className='cart__product-card__counter-value'>{count}</span>
            <button
              className='cart__product-card__counter-button icon'
              onClick={() => {
                setCount(count + 1);
                handleCount('plus');
              }}
            >
              +
            </button>
          </div>
          <div className='cart__product-card__total'>
            <div className='cart__product-card__total-value'>{totalPrice}$</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
