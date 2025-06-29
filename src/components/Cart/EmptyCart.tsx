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
      <div className='empty_container'>
        <h2 className='empty-cart-header'>Your cart is empty</h2>
        <p className='medium'>
          There are no items in your shopping cart. Click here to continue
          selecting products.
        </p>
        <button  onClick={handleClick}>
          <span>Go back to catalog</span>
        </button>
      </div>
    </>
  );
};

export default EmptyCart;
