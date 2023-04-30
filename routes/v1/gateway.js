import { Router } from 'express';
import { urlRouter } from './url.js';
import { accountRouter } from './account.js';

export const gatewayRouter = Router();

gatewayRouter.use('/url', urlRouter);
gatewayRouter.use('/account', accountRouter);
