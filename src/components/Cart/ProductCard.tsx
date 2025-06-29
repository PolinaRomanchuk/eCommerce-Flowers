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
      <div className='product-card-container'>
        <div className='product-card-content'>
          <button className='close-button icon' onClick={handleRemoveProduct}>
            x
          </button>
          <div className='product-card-image-container'>
            <img className='product-card-image' src={img} alt='photo' />
          </div>
          <div className='product-card-info-container'>
            <div className='medium'>{name}</div>
            {color && (
              <div className='product-color'>
                <p className='extra-light'>Color:</p> {color}
              </div>
            )}
          </div>
          <div className='product-price-container'>
            {discountedPrice ? (
              <>
                <div className='old-price-for-item'>
                  <p className='extra-light'>{price}</p>
                </div>
                <div className='final-price-for-item'>
                  <p className='extra-light'>{discountedPrice}</p>
                </div>
              </>
            ) : (
              <div className='final-price-for-item'>
                <p className='regular'>{price}</p>
              </div>
            )}
          </div>
          <div className='product-counter-container'>
            <button
              className='minus-button icon'
              onClick={() => {
                if (count > 1) {
                  setCount(count - 1);
                  handleCount('minus');
                }
              }}
            >
              -
            </button>
            <span className='current-product-count'>{count}</span>
            <button
              className='plus-button icon'
              onClick={() => {
                setCount(count + 1);
                handleCount('plus');
              }}
            >
              +
            </button>
          </div>
          <div className='product-price-container'>
            <div className='final-price-for-all-items'>{totalPrice}$</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
