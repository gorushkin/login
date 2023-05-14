import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { ValidateError } from './error';
import type { FastifyCookieOptions } from '@fastify/cookie';
import jwt from 'jsonwebtoken';
import cookie from '@fastify/cookie';
import { config } from './config';
const app = fastify();

const generateToken = (login: string) =>
  jwt.sign({ login }, config.JWT_SECRET, { expiresIn: '1m' });

const user = {
  login: 'ivan',
  password: '1235',
};

const ERROR_PAYLOAD = 'There is no data in the payload';
const ERROR_WRONG_USER = 'There is no user with this login';
const ERROR_WRONG_PASSWORD = 'The password is not correct';
const ERROR_LOGIN_EXIST = 'User with this login already exists';
const ERROR_PASSWORDS = 'Confirm password is not same as password';

app.register(cookie, {
  secret: 'my-secret',
  parseOptions: {},
} as FastifyCookieOptions);

const delay = async (cb: any, timeout: number) => {
  return new Promise((res) =>
    setTimeout(() => {
      res(cb());
    }, timeout)
  );
};

app.post('/login', async (req: FastifyRequest, res: FastifyReply) => {
  const body = req.body as {
    login: string;
    password: string;
  };

  if (!body.login || !body.password) throw new ValidateError(ERROR_PAYLOAD, 400, [ERROR_PAYLOAD]);

  if (body.login !== user.login) throw new ValidateError(ERROR_WRONG_USER, 400, [ERROR_WRONG_USER]);

  if (body.password !== user.password)
    throw new ValidateError(ERROR_WRONG_PASSWORD, 400, [ERROR_WRONG_PASSWORD]);

  const token = generateToken(body.login);

  const reply = () => {
    res
      .cookie('token', token)
      .status(200)
      .send({ ok: true, data: { user: 'Ivan', age: 23 } });
  };

  await delay(reply, 500);
});

app.post('/register', (req, res) => {
  const body = req.body as {
    login: string;
    name: string;
    password: string;
    passwordConfirm: string;
  };

  if (!body.login || !body.password || !body.name || !body.passwordConfirm)
    throw new ValidateError(ERROR_PAYLOAD, 400, [ERROR_PAYLOAD]);

  if (body.login === user.login)
    throw new ValidateError(ERROR_LOGIN_EXIST, 400, [ERROR_LOGIN_EXIST]);

  if (body.password !== body.passwordConfirm)
    throw new ValidateError(ERROR_PASSWORDS, 400, [ERROR_PASSWORDS]);

  const newUser = { login: body.login, name: body.name };

  res.status(200).send({ ok: true, data: newUser });
});

app.get('*', (req, res) => {
  res.status(200).send({ message: 'Server is running!' });
});

app.setErrorHandler(async (error, _request, reply) => {
  if (error instanceof ValidateError) {
    const { errors, statusCode } = error;
    await delay(() => reply.status(statusCode).send({ ok: false, errors }), 500);
  }
  if (error instanceof SyntaxError) {
    reply.status(400).send({ ok: false, error: 'Something wrong with your request' });
  }
  reply.status(500).send({ ok: false, error: 'Something went wrong' });
});

export const appStart = async (port: number, host: string) => {
  try {
    app.listen({ port, host }, () => {
      console.log(`Server started at port ${port}`);
    });
  } catch (err) {
    app.log.error(err);
  }
};
