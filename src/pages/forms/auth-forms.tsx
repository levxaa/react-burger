import type { ReactNode, FormEvent } from 'react';

import styles from './auth-forms.module.css';

type AuthFormProps = {
  children: ReactNode;
  onSubmit?: (e: FormEvent) => void;
};

export const AuthForm = ({ children, onSubmit }: AuthFormProps): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
};
