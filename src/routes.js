import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import RecipientsController from './app/controllers/RecipientsController.js';
import SessionController from './app/controllers/SessionController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import OrdersController from './app/controllers/OrdersController';
import StartDeliveryController from './app/controllers/StartDeliveryController';
import NotificationController from './app/controllers/NotificationController';
import FinishedDeliveriesController from './app/controllers/FinishedDeliveriesController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/notifications/:id', NotificationController.index);
routes.get('/finished_notifications/:id', FinishedDeliveriesController.index);
routes.post('/sessions', SessionController.store);

routes.get('/deliveries/:id', StartDeliveryController.index); // List orders by deliverymans
routes.put('/deliveries/:delivery_id', StartDeliveryController.update);

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
routes.delete('/orders/:id', OrdersController.delete);

export default routes;
