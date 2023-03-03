import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const appConfig = (app: Application) => {
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
};

export default appConfig;
