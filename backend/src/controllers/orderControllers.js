import { v4 as uuidv4 } from 'uuid';
import Order from '../models/order.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import razorpay from '../config/razorpay.js';
import { sendResponse, generateHmacSha256 } from '../utils/helpers.js';

export const createOrder = handleAsync(async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: uuidv4(),
  };

  const razorpayOrder = await razorpay.orders.create(options);

  const order = await Order.create(
    [
      {
        _id: razorpayOrder.id,
        amount,
      },
    ],
    { validateBeforeSave: false }
  );

  sendResponse(res, 201, 'Order created successfully', order[0]);
});

export const confirmOrder = handleAsync(async (req, res) => {
  const { orderId } = req.params;
  const { razorpayPaymentId, razorpaySignature } = req.body;

  let order = await Order.findById(orderId);

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  if (order.isPaid) {
    throw new CustomError('This order has already been confirmed', 409);
  }

  const generatedSignature = generateHmacSha256(
    orderId + '|' + razorpayPaymentId,
    process.env.RAZORPAY_KEY_SECRET
  );

  if (razorpaySignature !== generatedSignature) {
    throw new CustomError('Provided invalid signature', 400);
  }

  order = await Order.findByIdAndUpdate(
    orderId,
    {
      isPaid: true,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  sendResponse(res, 200, 'Order placed successfully', order);
});

export const fetchOrderById = handleAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await razorpay.orders.fetch(orderId);

  sendResponse(res, 200, 'Order fetched by ID successfully', order);
});

export const fetchOrderPayments = handleAsync(async (req, res) => {
  const { orderId } = req.params;

  const payments = await razorpay.orders.fetchPayments(orderId);

  sendResponse(res, 200, 'Payments for an order fetched successfully', payments);
});
