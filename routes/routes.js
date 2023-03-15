const express = require('express');
const {
  createOrder,
  fetchAllOrders,
  fetchOrderById,
  fetchOrderPayments,
  capturePayment,
  fetchPaymentById,
  fetchAllPayments,
  fetchPaymentCardDetails,
  initiatePaymentRefund,
  fetchMultipleRefundsOfPayment,
  fetchSpecificRefundOfPayment,
  fetchAllRefunds,
  fetchRefundById,
  fetchAllSettlements,
  fetchSettlementById,
  fetchSettlementReports,
} = require('../controllers/razorpay.controllers');

const router = express.Router();

router.post('/api/order/create', createOrder);
router.get('/api/orders', fetchAllOrders);
router.get('/api/order/:orderId', fetchOrderById);
router.get('/api/order/:orderId/payments', fetchOrderPayments);
router.post('/api/payment/:paymentId/capture', capturePayment);
router.get('/api/payment/:paymentId', fetchPaymentById);
router.get('/api/payments', fetchAllPayments);
router.get('/api/payment/:paymentId/card', fetchPaymentCardDetails);
router.post('/api/payment/:paymentId/refund', initiatePaymentRefund);
router.get('/api/payment/:paymentId/refunds', fetchMultipleRefundsOfPayment);
router.get('/api/payment/:paymentId/refund/:refundId', fetchSpecificRefundOfPayment);
router.get('/api/refunds', fetchAllRefunds);
router.get('/api/refund/:refundId', fetchRefundById);
router.get('/api/settlements', fetchAllSettlements);
router.get('/api/settlement/:settlementId', fetchSettlementById);
router.get('/api/settlements/reports', fetchSettlementReports);

module.exports = router;
