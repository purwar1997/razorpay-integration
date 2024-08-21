import { v4 as uuidv4 } from 'uuid';
import razorpay from '../config/razorpay.js';
import handleAsync from '../utils/handleAsync.js';
import { sendResponse } from '../utils/helpers.js';

export const createRefund = handleAsync(async (req, res) => {
  const { paymentId } = req.params;
  const { amount, speed } = req.body;

  const refund = await razorpay.payments.refund(paymentId, {
    amount: amount * 100,
    speed,
    receipt: uuidv4(),
  });

  sendResponse(res, 201, 'Refund created successfully', refund);
});

export const fetchPaymentRefunds = handleAsync(async (req, res) => {
  const { paymentId } = req.params;
  const { skip, limit } = req.query;

  const refunds = await razorpay.payments.fetchMultipleRefund(paymentId, {
    skip: skip || 0,
    count: limit || 10,
  });

  sendResponse(res, 200, 'Refunds for a payment fetched successfully', refunds);
});

export const fetchAllRefunds = handleAsync(async (req, res) => {
  const { skip, limit } = req.query;

  const refunds = await razorpay.refunds.all({
    skip: skip || 0,
    count: limit || 10,
  });

  sendResponse(res, 200, 'Refunds fetched successfully', refunds);
});

export const fetchRefundById = handleAsync(async (req, res) => {
  const { refundId } = req.params;

  const refund = await razorpay.refunds.fetch(refundId);

  sendResponse(res, 200, 'Refund by ID fetched successfully', refund);
});

export const updateRefund = handleAsync(async (req, res) => {
  const { refundId } = req.params;
  const { notes } = req.body;

  const refund = await razorpay.refunds.edit(refundId, {
    notes,
  });

  sendResponse(res, 200, 'Refund updated sucessfully', refund);
});