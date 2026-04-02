import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { Home } from '@pages/home';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <AppHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ingredients/:id" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
