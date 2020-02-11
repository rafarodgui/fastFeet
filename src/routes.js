import { Router } from 'express';
import RecipientsController from './app/controllers/RecipientsController.js';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/recipients', RecipientsController.store);
routes.get('/recipients', RecipientsController.index);

routes.post('/sessions', SessionController.store);

export default routes;
