import * as dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = '127.0.0.1';
const JWT_SECRET = '12345'

export const config = { PORT, HOST, JWT_SECRET };
