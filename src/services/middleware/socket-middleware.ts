import { getRefreshToken, refreshTokenRequest, setTokens } from '../../utils/api';

import type { TOrdersResponse } from '../../utils/types';
import type { AppDispatch } from '../store';
import type { Middleware, MiddlewareAPI, PayloadAction } from '@reduxjs/toolkit';

type TSocketMessage = TOrdersResponse | { success: boolean; message: string };

type SocketMiddlewareConfig = {
  wsUrl: string;
  actions: {
    connect: string;
    disconnect: string;
    onOpen: string;
    onMessage: string;
    onError: string;
    onClose: string;
  };
  requiresToken?: boolean;
};

export const socketMiddleware = (config: SocketMiddlewareConfig): Middleware => {
  const { wsUrl, actions, requiresToken = false } = config;
  let socket: WebSocket | null = null;
  let token: string | undefined;
  return (store: MiddlewareAPI<AppDispatch>) => (next) => (action) => {
    const { type } = action as PayloadAction;
    if (type === actions.connect) {
      if (socket) {
        socket.close();
        socket = null;
      }

      if (requiresToken) {
        const { payload } = action as PayloadAction<string>;
        token = payload;

        if (token?.startsWith('Bearer ')) {
          token = token.replace('Bearer ', '');
        }

        if (!token) {
          store.dispatch({
            type: actions.onError,
            payload: 'Authentication token missing',
          });
          return next(action);
        }
      }

      let isRefreshing = false;

      const connect = (customToken?: string): void => {
        const finalToken = customToken ?? token;
        const url = finalToken ? `${wsUrl}?token=${finalToken}` : wsUrl;
        socket = new WebSocket(url);

        socket.onopen = (): void => {
          isRefreshing = false;
          store.dispatch({
            type: actions.onOpen,
            payload: true,
          });
        };

        socket.onmessage = (event: MessageEvent<string>): void => {
          try {
            const data: TSocketMessage = JSON.parse(event.data) as TSocketMessage;

            if (!data.success && data.message === 'Invalid or missing token') {
              if (requiresToken && !isRefreshing) {
                isRefreshing = true;
                const refreshToken = getRefreshToken();
                if (refreshToken) {
                  refreshTokenRequest(refreshToken)
                    .then((tokens) => {
                      setTokens(tokens.accessToken, tokens.refreshToken);
                      connect(tokens.accessToken);
                    })
                    .catch(() => {
                      store.dispatch({
                        type: actions.onError,
                        payload: 'Сессия истекла, войдите снова',
                      });
                    });
                } else {
                  store.dispatch({
                    type: actions.onError,
                    payload: 'Сессия истекла, войдите снова',
                  });
                }
              }
              return;
            }

            if ('orders' in data) {
              store.dispatch({
                type: actions.onMessage,
                payload: data,
              });
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
            store.dispatch({
              type: actions.onError,
              payload: 'Ошибка парсинга сообщения от сервера',
            });
          }
        };

        socket.onerror = (): void => {
          if (socket && socket.readyState === WebSocket.CLOSING) {
            return;
          }
          console.error('WebSocket error');
          console.error('Socket readyState:', socket?.readyState);
          store.dispatch({
            type: actions.onError,
            payload: 'Ошибка WebSocket-соединения',
          });
        };

        socket.onclose = (): void => {
          store.dispatch({
            type: actions.onClose,
            payload: false,
          });
          socket = null;
        };
      };

      connect();
    }

    if (type === actions.disconnect) {
      if (socket) {
        socket.close();
        socket = null;
      }
    }

    return next(action);
  };
};

export const feedMiddleware = socketMiddleware({
  wsUrl: 'wss://new-stellarburgers.education-services.ru/orders/all',
  actions: {
    connect: 'feed/connect',
    disconnect: 'feed/disconnect',
    onOpen: 'feed/onOpen',
    onMessage: 'feed/onMessage',
    onError: 'feed/onError',
    onClose: 'feed/onClose',
  },
  requiresToken: false,
});

export const userOrdersMiddleware = socketMiddleware({
  wsUrl: 'wss://new-stellarburgers.education-services.ru/orders',
  actions: {
    connect: 'userOrders/connect',
    disconnect: 'userOrders/disconnect',
    onOpen: 'userOrders/onOpen',
    onMessage: 'userOrders/onMessage',
    onError: 'userOrders/onError',
    onClose: 'userOrders/onClose',
  },
  requiresToken: true,
});
