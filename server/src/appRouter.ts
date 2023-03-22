import { Application } from 'express';
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import roleRoute from './routes/roleRoute';
import permissionRoute from './routes/permissionRoute';
import mediaRoute from './routes/mediaRoute';

const appRouter = (app: Application) => {
  const apiRoute = '/api/v1';

  app.use(`${apiRoute}/auth`, authRoute);
  app.use(`${apiRoute}/user`, userRoute);
  app.use(`${apiRoute}/role`, roleRoute);
  app.use(`${apiRoute}/permission`, permissionRoute);
  app.use(`${apiRoute}/media`, mediaRoute);
};

export default appRouter;
