import { test as setup } from '@playwright/test';

import type { TAuthResponse } from '../src/utils/api';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page, request }) => {
  const response = await request.post(
    'https://new-stellarburgers.education-services.ru/api/auth/login',
    { data: { email: 'test@testmail.ru', password: '00000000' } }
  );

  const data: TAuthResponse = (await response.json()) as TAuthResponse;

  if (!data.success) {
    throw new Error(`Authentication failed: ${JSON.stringify(data)}`);
  }

  await page.addInitScript((tokenData: TAuthResponse) => {
    localStorage.setItem('accessToken', tokenData.accessToken);
    localStorage.setItem('refreshToken', tokenData.refreshToken);
    if (tokenData.user) {
      localStorage.setItem('user', JSON.stringify(tokenData.user));
    }
  }, data);

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.context().storageState({ path: authFile });
});
