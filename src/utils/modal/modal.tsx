import type { JSX, ReactNode } from 'react';
import '../modal/modal.scss';

type ModalProps = {
  active: boolean;
  setActive: (value: boolean) => void;
  children: ReactNode;
  onClose?: () => void;
};

const Modal = ({
  active,
  setActive,
  children,
  onClose,
}: ModalProps): JSX.Element => {
  const handleClose = (): void => {
    setActive(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={active ? 'modal-overlay active' : 'modal-overlay'}
      onClick={handleClose}
    >
      <div
        className={active ? 'modal-container active' : 'modal-container'}
        onClick={(event) => event.stopPropagation()}
      >
        <button className='close-window-button icon' onClick={handleClose}>
          x
        </button>

        {children}
      </div>
    </div>
  );
};
export default Modal;
