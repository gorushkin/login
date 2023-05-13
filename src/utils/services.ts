import { config } from '../config/config';

export enum ROUTE {
  login = '/login',
  register = '/register',
}

const getRoute = (route: ROUTE) => config.BASE_URL.API_BASE_URL + route;

export type Response<K> = { ok: true; data: K } | { ok: false; errors: string[] };

export type Request<T, K> = (data: T) => Promise<Response<K>>;

export type LoginRequestPayload = { login: string; password: string };
export type LoginRequestResult = { user: string };

type RegisterRequestPayload = {
  login: string;
  password: string;
  repeatPassword: string;
  name: string;
};

type RegisterRequestResult = { user: string };

const request =
  <T, K>(route: ROUTE) =>
  async (body: T) => {
    const response = await fetch(getRoute(route), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return (await response.json()) as K;
  };

export const loginRequest: Request<LoginRequestPayload, LoginRequestResult> = await request(
  ROUTE.login
);

export const registerRequest: Request<RegisterRequestPayload, RegisterRequestResult> =
  await request(ROUTE.register);
