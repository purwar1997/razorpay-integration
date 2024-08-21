import express from 'express';
import {
  createRefund,
  fetchPaymentRefunds,
  fetchAllRefunds,
  fetchRefundById,
  updateRefund,
} from '../controllers/refundControllers.js';

const router = express.Router();

router.post('/payments/:paymentId/refund', createRefund);
router.get('/payments/:paymentId/refunds', fetchPaymentRefunds);
router.get('/refunds', fetchAllRefunds);
router.get('/refunds/:refundId', fetchRefundById);
router.patch('/refunds/:refundId', updateRefund);

export default router;
