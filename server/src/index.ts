require('dotenv').config();
import 'reflect-metadata';
import express from 'express';
import AppDataSource from './AppDataSource';
import appConfig from './appConfig';
import appRouter from './appRouter';

const main = async () => {
  AppDataSource.initialize()
    .then(() => console.log('DB connected'))
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });

  const app = express();

  appConfig(app);

  appRouter(app);

  const PORT = process.env.PORT || 4001;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

main().catch((error) => console.log(error));
