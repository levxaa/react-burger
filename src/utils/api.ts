import { BASE_URL } from './constants';
const checkResponse = <T>(res: Response): Promise<T> => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(new Error(`Ошибка ${res.status}`));
};

const checkSuccess = <T>(res: T): Promise<T> => {
  if (
    res &&
    typeof res === 'object' &&
    'success' in res &&
    (res as { success?: boolean }).success
  ) {
    return Promise.resolve(res);
  }
  return Promise.reject(new Error(`Ответ не success`));
};

export const request = <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  return fetch(`${BASE_URL}${endpoint}`, options)
    .then((res) => checkResponse<T>(res))
    .then((res) => checkSuccess<T>(res));
};
