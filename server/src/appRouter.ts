import { Application } from 'express';
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import roleRoute from './routes/roleRoute';
import mediaRoute from './routes/mediaRoute';

const appRouter = (app: Application) => {
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/user', userRoute);
  app.use('/api/v1/role', roleRoute);
  app.use('/api/v1/media', mediaRoute);
};

export default appRouter;
