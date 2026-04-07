import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthForm } from '../auth-forms';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('');

  return (
    <AuthForm>
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
        <Link to="/login">
          Войти
        </Link>
      </p>
    </AuthForm>
  );
};
