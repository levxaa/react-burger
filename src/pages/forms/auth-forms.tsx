import type { ReactNode } from 'react';

import styles from './auth-forms.module.css';

interface AuthFormProps {
  children: ReactNode;
}

export const AuthForm = ({ children }: AuthFormProps): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <form className={styles.form}>{children}</form>
    </div>
  );
};
