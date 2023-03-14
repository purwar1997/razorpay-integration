import settlements from 'razorpay/dist/types/settlements';

const uuid = require('uuid');
const razorpay = require('../config/razorpay.config');
const asyncHandler = require('../services/asyncHandler');

// Create an order
export const createOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    throw new Error('Order amount not provided');
  }

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: 'INR',
    receipt: uuid.v4(),
  });

  res.status(201).json({
    success: true,
    message: 'Order successfully created',
    order,
  });
});

// Fetch all orders
export const fetchAllOrders = asyncHandler(async (_req, res) => {
  const orders = await razorpay.orders.all({ count: 100, 'expand[]': 'payments.card' });

  res.status(200).json({
    success: true,
    message: 'All orders successfully fetched',
    orders: orders.items,
  });
});

// Fetch an order by id
export const fetchOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new Error('Order id not provided');
  }

  const order = await razorpay.orders.fetch(orderId);

  res.status(200).json({
    success: true,
    message: 'Order successfully fetched',
    order,
  });
});

// Fetch all payments of an order
export const fetchOrderPayments = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new Error('Order id not provided');
  }

  const payments = await razorpay.orders.fetchPayments(orderId);

  res.status(200).json({
    success: true,
    message: `Payments successfully fetched for order ${orderId}`,
    payments,
  });
});

// Capture an authorized payment
export const capturePayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { amount } = req.body;

  if (!paymentId) {
    throw new Error('Payment id not provided');
  }

  if (!amount) {
    throw new Error('Payment amount not provided');
  }

  const payment = await razorpay.payments.capture(paymentId, { amount, currency: 'INR' });

  res.status(201).json({
    success: true,
    message: 'Payment successfully captured',
    payment,
  });
});

// Fetch a payment by id
export const fetchPaymentById = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    throw new Error('Payment id not provided');
  }

  const payment = await razorpay.payments.fetch(paymentId, { 'expand[]': 'card' });

  res.status(200).json({
    success: true,
    message: 'Payment details successfully fetched',
    payment,
  });
});

// Fetch all payments
export const fetchAllPayments = asyncHandler(async (_req, res) => {
  const payments = await razorpay.payments.all({ count: 100, 'expand[]': 'card' });

  res.status(200).json({
    success: true,
    message: 'Payments successfully fetched',
    payments: payments.items,
  });
});

// Fetch card details of a payment
export const fetchPaymentCardDetails = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    throw new Error('Payment id not provided');
  }

  const card = await razorpay.payments.fetchCardDetails(paymentId);

  res.status(200).json({
    success: true,
    message: 'Card details successfully fetched',
    card,
  });
});

// Initiate instant refund for a payment (full or partial)
export const initiatePaymentRefund = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { amount } = req.body;

  if (!paymentId) {
    throw new Error('Payment id not provided');
  }

  if (!amount) {
    throw new Error('Refund amount not provided');
  }

  const refund = await razorpay.payments.refund(paymentId, {
    amount: amount * 100,
    speed: 'optimum',
    receipt: new Date(),
  });

  res.status(201).json({
    success: true,
    message: 'Refund successfully initiated',
    refund,
  });
});

// Fetch multiple refunds for a payment
export const fetchMultipleRefundsOfPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    throw new Error('Payment id not provided');
  }

  const refunds = await razorpay.payments.fetchMultipleRefund(paymentId);

  res.status(201).json({
    success: true,
    message: 'Refunds successfully fetched',
    refunds: refunds.items,
  });
});

// Fetch a specific refund for a payment
export const fetchSpecificRefundOfPayment = asyncHandler(async (req, res) => {
  const { paymentId, refundId } = req.params;

  if (!paymentId) {
    throw new Error('Payment id not provided');
  }

  if (!refundId) {
    throw new Error('Refund id not provided');
  }

  const refund = await razorpay.payments.fetchRefund(paymentId, refundId);

  res.status(201).json({
    success: true,
    message: 'Refund successfully fetched',
    refund,
  });
});

// Fetch all refunds
export const fetchAllRefunds = asyncHandler(async (_req, res) => {
  const refunds = await razorpay.refunds.all({ count: 100 });

  res.status(201).json({
    success: true,
    message: 'Refunds successfully fetched',
    refunds: refunds.items,
  });
});

// Fetch refund by id
export const fetchRefundById = asyncHandler(async (req, res) => {
  const { refundId } = req.params;

  if (!refundId) {
    throw new Error('Refund id not provided');
  }

  const refund = await razorpay.refunds.fetch(refundId);

  res.status(201).json({
    success: true,
    message: 'Refund successfully fetched',
    refund,
  });
});

// Fetch all settlements
export const fetchAllSettlements = asyncHandler(async (_req, res) => {
  const settlements = await razorpay.settlements.all({ count: 100 });

  res.status(200).json({
    success: true,
    message: 'Settlements successfully fetched',
    settlements: settlements.items,
  });
});

// Fetch settlement by id
export const fetchSettlementById = asyncHandler(async (req, res) => {
  const { settlementId } = req.params;

  if (!settlementId) {
    throw new Error('Settlement id not provided');
  }

  const settlement = await razorpay.settlements.fetch(settlementId);

  res.status(200).json({
    success: true,
    message: 'Settlement successfully fetched',
    settlement,
  });
});

// Fetch all settlements of a month or day
export const fetchAllSettlementsOfMonthOrDay = asyncHandler(async (req, res) => {
  const { year, month, day } = req.query;

  if (!(year && month)) {
    throw new Error('Please provide an year and month');
  }

  let settlements;

  if (day) {
    settlements = await razorpay.settlements.settlementRecon({
      year,
      month,
      day,
      count: 100,
    });
  } else {
    settlements = await razorpay.settlements.settlementRecon({
      year,
      month,
      count: 100,
    });
  }

  res.status(200).json({
    success: true,
    message: `All settlements successfully fetched`,
    settlements: settlements.items,
  });
});
