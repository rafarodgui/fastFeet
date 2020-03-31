import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import RecipientsController from './app/controllers/RecipientsController.js';
import SessionController from './app/controllers/SessionController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import OrdersController from './app/controllers/OrdersController';
import DeliveryController from './app/controllers/DeliveryController';
import NotificationController from './app/controllers/NotificationController';
import FinishedDeliveriesController from './app/controllers/FinishedDeliveriesController';
import DeliveryProblemController from './app/controllers/DeliveryProblemsController';
import AllDeliveryProblemController from './app/controllers/AllDeliveryProblemController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/notifications/:id', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

// List orders by deliverymans
routes.get('/deliveryman/:deliveryman_id/deliveries', DeliveryController.index);

// Deliveryman can change the status of start_date and end_date
routes.put(
  '/deliveryman/:deliveryman_id/delivery/:delivery_id',
  DeliveryController.update
);

routes.get(
  '/deliveryman/:id/finished_deliveries',
  FinishedDeliveriesController.index
);

routes.post('/delivery/:id/problems', DeliveryProblemController.store);

routes.get('/delivery/:id/problems', DeliveryProblemController.index);

routes.use(authMiddleware);

routes.post('/recipients', RecipientsController.store);
routes.get('/recipients', RecipientsController.index);
routes.put('/recipients/:id', RecipientsController.update);

routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman/:id', DeliverymanController.update);

routes.post('/files', upload.single('file'), FileController.store);
routes.get('/files', FileController.index);

routes.post('/orders', OrdersController.store);
routes.get('/orders', OrdersController.index); // List all orders
routes.put('/orders/:id', OrdersController.update);

routes.delete('/problem/:id/cancel_delivery', OrdersController.delete);

routes.get('/all_delivery_with_problems', AllDeliveryProblemController.index);

export default routes;
