import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './auth.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('');

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h2 className="text text_type_main-medium mb-6">Восстановление пароля</h2>
        <Input
          placeholder="Укажите e-mail"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          extraClass="mb-6"
        />
        <Button type="primary" size="medium" htmlType="button" extraClass="mb-20">
          Восстановить
        </Button>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
};
