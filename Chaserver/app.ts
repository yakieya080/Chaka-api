import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import router from './routes.js';

const app = express();

// Pino-http koodii salphaa ta'een fayyadami
app.use(pinoHttp());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

export default app;
