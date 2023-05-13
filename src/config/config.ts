interface Config {
  API_BASE_URL: string;
  ORIGIN: string;
}

export type MODE = 'production' | 'development';

const mode: MODE = (import.meta.env.MODE as MODE) || 'production';

const development = {
  API_BASE_URL: '/api',
  ORIGIN: 'http://localhost:3000',
};

const production = {
  API_BASE_URL: '/api',
  ORIGIN: 'https://api.gorushkin.com/login_test',
};

const urlMapping: Record<MODE, Config> = {
  development,
  production,
};

const BASE_URL = urlMapping[mode];

export const config = { BASE_URL };
