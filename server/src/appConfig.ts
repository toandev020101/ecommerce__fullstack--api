import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';

const appConfig = (app: Application) => {
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(express.static('./uploads'));
};

export default appConfig;
