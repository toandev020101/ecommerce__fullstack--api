import { Application } from 'express';
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';

const appRouter = (app: Application) => {
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/user', userRoute);
};

export default appRouter;
