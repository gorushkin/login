import { appStart } from './app';
import { config } from './config';
import { server } from './express';

console.log('start');

appStart(config.PORT, config.HOST);

// server(config.PORT);
