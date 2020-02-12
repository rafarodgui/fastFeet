import { Router } from 'express';
import RecipientsController from './app/controllers/RecipientsController.js';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientsController.store);
routes.get('/recipients', RecipientsController.index);
routes.put('/recipients/:id', RecipientsController.update);

export default routes;
