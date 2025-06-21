import type { ReactElement } from 'react';
import './cart.scss';
import { useNavigate } from 'react-router-dom';
export const EmptyCart = (): ReactElement => {
  const navigate = useNavigate();
  const handleClick = (): void => {
    navigate('/catalog');
  };
  return (
    <>
      <h2 className='empty-cart-header'>Your cart is empty</h2>
      <p className='empty-cart-message'>
        There are no items in your shopping cart. Click here to continue
        selecting products.
      </p>
      <span className='go-to-catalog-button' onClick={handleClick}>
        Go back to catalog
      </span>
    </>
  );
};

export default EmptyCart;
