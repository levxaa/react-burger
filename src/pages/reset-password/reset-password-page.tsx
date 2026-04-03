import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './auth.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h2 className="text text_type_main-medium mb-6">Восстановление пароля</h2>
        <PasswordInput
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          extraClass="mb-6"
        />
        <Input
          placeholder="Введите код из письма"
          type="text"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          extraClass="mb-6"
        />
        <Button type="primary" size="medium" htmlType="button" extraClass="mb-20">
          Сохранить
        </Button>
        <p className="text text_type_main-default text_color_inactive">
          Уже были на этой странице?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
};
