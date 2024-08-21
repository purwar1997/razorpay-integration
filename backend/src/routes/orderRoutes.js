import express from 'express';
import {
  createOrder,
  confirmOrder,
  fetchOrderById,
  fetchOrderPayments,
} from '../controllers/orderControllers.js';

const router = express.Router();

router.post('/orders', createOrder);
router.patch('/orders/:orderId/confirm', confirmOrder);
router.get('/orders/:orderId', fetchOrderById);
router.get('/orders/:orderId/payments', fetchOrderPayments);

export default router;
