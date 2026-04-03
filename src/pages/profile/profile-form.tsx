import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import styles from './profile.module.css';

export const ProfileForm = (): React.JSX.Element => {
  const [name, setName] = useState('user');
  const [login, setLogin] = useState('user@example.com');
  const [password, setPassword] = useState('');

  return (
    <form className={styles.form}>
      <Input
        placeholder="Имя"
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        extraClass="mb-6"
        icon="EditIcon"
      />
      <Input
        placeholder="Логин"
        type="text"
        name="login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        extraClass="mb-6"
        icon="EditIcon"
      />
      <PasswordInput
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        extraClass="mb-6"
        icon="EditIcon"
      />
    </form>
  );
};
