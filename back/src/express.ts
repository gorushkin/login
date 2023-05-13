import express from 'express';
import { ValidateError } from './error';

const app = express();

app.use(express.json());

app.post('/login', async (req, res) => {
  const body = req.body as {
    login: string;
    password: string;
  };

  console.log(req.body);
  console.log(req.headers.cookie);

  // if (!body?.login || !body?.password)
  //   throw new ValidateError('There is no data in the payload', 400);

  const token = '1234567890';

  res.cookie('token', token).status(200).send({ message: 'Server is running!' });

  // res.header('set-cookie', token).headers({ Authorization: token }).status(200).send({ ok: true });
});

app.post('/auth', (req, res) => {
  res.status(200).send({ message: 'Server is running!' });
});

app.get('/', (req, res) => {
  res.cookie('cookieName', 'cookieValue').send('Express + TypeScript Server');
});

export const server = async (port: number) => {
  try {
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.log('err: ');
  }
};
