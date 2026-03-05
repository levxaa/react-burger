import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  children: React.ReactNode;
  onClick: () => void;
};

export const ModalOverlay = ({
  children,
  onClick,
}: TModalOverlayProps): React.JSX.Element => {
  return (
    <div className={styles.overlay} onClick={onClick}>
      {children}
    </div>
  );
};
