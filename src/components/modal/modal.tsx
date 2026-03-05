import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ModalOverlay } from './modal-overlay';

import styles from './modal.module.css';

type TModalProps = {
  header?: string;
  children: React.ReactNode;
  onClose: () => void;
};

const modalRoot = document.getElementById('modal')!;

export const Modal = ({ header, children, onClose }: TModalProps): React.JSX.Element => {
  useEffect((): (() => void) => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return (): void => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <div
        className={`${styles.modal} pl-10 pt-10 pr-10 pb-15`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modal_top}>
          <span className="text text_type_main-large">{header}</span>
          <CloseIcon type="primary" onClick={onClose} />
        </div>
        {children}
      </div>
    </ModalOverlay>,
    modalRoot
  );
};
