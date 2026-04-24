import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';

import { updateUser } from '@services/auth/reducer';
import { useAppDispatch, useAppSelector } from '@services/store';

export const ProfileForm = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const hasChanges = name !== user.name || email !== user.email || password !== '';
      setIsChanged(hasChanges);
    }
  }, [name, email, password, user]);

  const handleSave = (): void => {
    const passwordToSend = password === '' ? '' : password;
    void dispatch(updateUser({ name, email, password: passwordToSend })).then(() => {
      setPassword('');
      setIsChanged(false);
    });
  };

  const handleCancel = (): void => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
      setIsChanged(false);
    }
  };

  return (
    <form>
      <Input
        placeholder="Имя"
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon="EditIcon"
        extraClass="mb-6"
      />
      <Input
        placeholder="Логин"
        type="text"
        name="login"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon="EditIcon"
        extraClass="mb-6"
      />
      <PasswordInput
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        extraClass="mb-6"
        icon="EditIcon"
      />
      {isChanged && (
        <div>
          <Button type="primary" size="medium" htmlType="button" onClick={handleSave}>
            Сохранить
          </Button>
          <Button
            type="secondary"
            size="medium"
            htmlType="button"
            onClick={handleCancel}
          >
            Отмена
          </Button>
        </div>
      )}
    </form>
  );
};
