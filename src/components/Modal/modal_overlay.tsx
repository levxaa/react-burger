import styles from './modal.module.css';

type TModalOverlayProps = {
  children: React.ReactNode;
  onClick: () => void;
};

export const ModalOverlay = ({
  children,
  onClick,
}: TModalOverlayProps): React.JSX.Element => {
  return (
    <div className={styles.modal_overlay as string} onClick={onClick}>
      {children}
    </div>
  );
};
