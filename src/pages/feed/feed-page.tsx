import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <p className={`${styles.placeholder} text text_type_main-large`}>
        Страница в разработке
      </p>
    </div>
  );
};
