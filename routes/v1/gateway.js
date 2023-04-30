import { Router } from 'express';
import { urlRouter } from './url.js';

export const gatewayRouter = Router();

gatewayRouter.use('/url', urlRouter);
