import { Application } from 'express';
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import roleRoute from './routes/roleRoute';
import permissionRoute from './routes/permissionRoute';
import mediaRoute from './routes/mediaRoute';
import provinceRoute from './routes/provinceRoute';
import districtRoute from './routes/districtRoute';
import wardRoute from './routes/wardRoute';
import categoryRoute from './routes/categoryRoute';
import tagRoute from './routes/tagRoute';
import variationRoute from './routes/variationRoute';
import variationOptionRoute from './routes/variationOptionRoute';
import productRoute from './routes/productRoute';
import cartItemRoute from './routes/cartItemRoute';
import orderRoute from './routes/orderRoute';
import shipMethodRoute from './routes/shipMethodRoute';
import paymentMethodRoute from './routes/paymentMethodRoute';
import couponRoute from './routes/couponRoute';
import orderStatusRoute from './routes/orderStatusRoute';

const appRouter = (app: Application) => {
  const apiRoute = '/api/v1';

  app.use(`${apiRoute}/auth`, authRoute);
  app.use(`${apiRoute}/user`, userRoute);
  app.use(`${apiRoute}/role`, roleRoute);
  app.use(`${apiRoute}/permission`, permissionRoute);
  app.use(`${apiRoute}/media`, mediaRoute);

  app.use(`${apiRoute}/province`, provinceRoute);
  app.use(`${apiRoute}/district`, districtRoute);
  app.use(`${apiRoute}/ward`, wardRoute);

  app.use(`${apiRoute}/product`, productRoute);
  app.use(`${apiRoute}/category`, categoryRoute);
  app.use(`${apiRoute}/tag`, tagRoute);
  app.use(`${apiRoute}/variation`, variationRoute);
  app.use(`${apiRoute}/variation-option`, variationOptionRoute);

  app.use(`${apiRoute}/cart-item`, cartItemRoute);
  app.use(`${apiRoute}/order`, orderRoute);
  app.use(`${apiRoute}/order-status`, orderStatusRoute);

  app.use(`${apiRoute}/ship-method`, shipMethodRoute);
  app.use(`${apiRoute}/payment-method`, paymentMethodRoute);
  app.use(`${apiRoute}/coupon`, couponRoute);
};

export default appRouter;
