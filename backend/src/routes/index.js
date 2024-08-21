import express from 'express';
import orderRouter from './orderRoutes.js';
import paymentRouter from './paymentRoutes.js';
import refundRouter from './refundRoutes.js';

const router = express.Router();

router.use(orderRouter);
router.use(paymentRouter);
router.use(refundRouter);

export default router;
