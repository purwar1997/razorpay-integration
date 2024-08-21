import express from 'express';
import {
  fetchPayments,
  fetchPaymentById,
  fetchCardDetails,
  capturePayment,
  updatePayment,
} from '../controllers/paymentControllers.js';

const router = express.Router();

router.get('/payments', fetchPayments);
router.get('/payments/:paymentId', fetchPaymentById);
router.get('/payments/:paymentId/card', fetchCardDetails);
router.post('/payments/:paymentId/capture', capturePayment);
router.patch('/payments/:paymentId', updatePayment);

export default router;
