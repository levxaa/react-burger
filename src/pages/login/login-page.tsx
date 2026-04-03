import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';

import styles from './auth.module.css';

export const LoginPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h2 className="text text_type_main-medium mb-6">Вход</h2>
        <Input
          placeholder="E-mail"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          extraClass="mb-6"
        />
        <PasswordInput
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          extraClass="mb-6"
        />
        <Button type="primary" size="medium" htmlType="button" extraClass="mb-20">
          Войти
        </Button>
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?{' '}
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </p>
        <p className="text text_type_main-default text_color_inactive mt-4">
          Забыли пароль?{' '}
          <Link to="/forgot-password" className={styles.link}>
            Восстановить пароль
          </Link>
        </p>
      </form>
    </div>
  );
};
