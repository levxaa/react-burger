import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { setNewPasswordRequest } from '../../../utils/api';
import { AuthForm } from '../auth-forms';

export const ResetPasswordPage = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hasRequestedReset = localStorage.getItem('passwordResetSent');
    if (!hasRequestedReset) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const resetPassword = async (): Promise<void> => {
      try {
        await setNewPasswordRequest(password, code);
        localStorage.removeItem('passwordResetSent');
        await navigate('/login', { replace: true });
      } catch (error) {
        console.error(error);
      }
    };
    void resetPassword();
  };

  return (
    <AuthForm onSubmit={handleSubmit}>
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
      <Button type="primary" size="medium" htmlType="submit" extraClass="mb-20">
        Сохранить
      </Button>
      <p className="text text_type_main-default text_color_inactive">
        Уже были на этой странице? <Link to="/login">Войти</Link>
      </p>
    </AuthForm>
  );
};
