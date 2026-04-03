import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';

import styles from './auth.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h2 className="text text_type_main-medium mb-6">Регистрация</h2>
        <Input
          placeholder="Имя"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          extraClass="mb-6"
        />
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
          Зарегистрироваться
        </Button>
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
};
