import { config } from '../config/config';

enum ROUTE {
  login = '/login',
  register = '/register',
}

const getRoute = (route: ROUTE) => config.BASE_URL.API_BASE_URL + route;

export type Response<K> = { ok: true; data: K } | { ok: false; errors: string[] };

export type Request<T, K> = (data: T) => Promise<Response<K>>;

type LoginRequestPayload = { login: string; password: string };
type LoginRequestResult = { user: string };

export const loginRequest: Request<LoginRequestPayload, LoginRequestResult> = async (body) => {
  const response = await fetch(getRoute(ROUTE.login), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};
