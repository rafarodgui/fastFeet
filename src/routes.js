import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import RecipientsController from './app/controllers/RecipientsController.js';
import SessionController from './app/controllers/SessionController';
import DeliverymanController from './app/controllers/DeliverymanController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientsController.store);
routes.get('/recipients', RecipientsController.index);
routes.put('/recipients/:id', RecipientsController.update);

routes.post('/deliveryman', DeliverymanController.store);

routes.post('./files', upload.single('files'), (req, res) => {
  return res.json({ ok: true });
});

export default routes;
