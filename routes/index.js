import { Router } from 'express';
import { gatewayRouter } from './v1/gateway.js';

export const router = Router();

router.use('/v1', gatewayRouter);
router.use(function (req, res) {
    res.status(501).send();
});
