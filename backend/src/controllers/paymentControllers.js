import handleAsync from '../utils/handleAsync.js';
import razorpay from '../config/razorpay.js';
import { sendResponse } from '../utils/helpers.js';

export const fetchPayments = handleAsync(async (req, res) => {
  const { skip, limit, method } = req.query;

  const payments = await razorpay.payments.all({
    skip: skip || 0,
    count: limit || 10,
    'expand[]': method,
  });

  sendResponse(res, 200, 'Payments fetched successfully', payments);
});

export const fetchPaymentById = handleAsync(async (req, res) => {
  const { paymentId } = req.params;
  const { method } = req.query;

  const payment = await razorpay.payments.fetch(paymentId, { 'expand[]': method });

  sendResponse(res, 200, 'Payment by ID fetched successfully', payment);
});

export const fetchCardDetails = handleAsync(async (req, res) => {
  const { paymentId } = req.params;

  const cardDetails = await razorpay.payments.fetchCardDetails(paymentId);

  sendResponse(res, 200, 'Card details of a payment fetched successfully', cardDetails);
});

export const capturePayment = handleAsync(async (req, res) => {
  const { paymentId } = req.params;
  const { amount, currency } = req.body;

  const payment = await razorpay.payments.capture(paymentId, amount * 100, currency);

  sendResponse(res, 200, 'Payment captured successfully', payment);
});

export const updatePayment = handleAsync(async (req, res) => {
  const { paymentId } = req.params;
  const { notes } = req.body;

  const payment = await razorpay.payments.edit(paymentId, {
    notes,
  });

  sendResponse(res, 200, 'Payment updated successfully', payment);
});
