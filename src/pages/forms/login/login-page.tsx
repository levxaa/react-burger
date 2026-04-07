import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { login } from '@services/auth/reducer';
import { useAppDispatch } from '@services/store';

import { AuthForm } from '../auth-forms';

type TLocationState = {
  from?: {
    pathname: string;
  };
};

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation() as unknown as Location & {
    state: TLocationState | null;
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname ?? '/profile';

  const handleSubmit = (): void => {
    const loginUser = async (): Promise<void> => {
      await dispatch(login({ email, password }));
      await navigate(from, { replace: true });
    };
    void loginUser();
  };

  return (
    <AuthForm>
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
      <Button
        type="primary"
        size="medium"
        htmlType="button"
        extraClass="mb-20"
        onClick={handleSubmit}
      >
        Войти
      </Button>
      <p className="text text_type_main-default text_color_inactive">
        Вы — новый пользователь? <Link to="/register">Зарегистрироваться</Link>
      </p>
      <p className="text text_type_main-default text_color_inactive mt-4">
        Забыли пароль? <Link to="/forgot-password">Восстановить пароль</Link>
      </p>
    </AuthForm>
  );
};
