import { appStart } from './app';
import { config } from './config';

console.log('start');

appStart(config.PORT, config.HOST);
