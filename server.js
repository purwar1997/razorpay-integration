const express = require('express');
const morgan = require('morgan');
const uuid = require(uuid);
const razorpay = require('./config/razorpay.config');
const config = require('./config/config');
const asyncHandler = require('./services/asyncHandler');

const app = express();

app.use(express.json());
app.use(
  morgan(
    ':remote-addr :date[web] :method :url HTTP/:http-version :status :res[content-type] :res[content-length] :response-time ms'
  )
);

// Create an order
app.post(
  '/api/order',
  asyncHandler(async (req, res) => {
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
  })
);

// Fetch all orders
app.get(
  '/api/orders',
  asyncHandler(async (_req, res) => {
    const orders = await razorpay.orders.all({ 'expand[]': 'payments.card' });

    res.status(200).json({
      success: true,
      message: 'All orders successfully fetched',
      orders: orders.items,
    });
  })
);

// Fetch an order by id
app.get(
  '/api/order/:orderId',
  asyncHandler(async (req, res) => {
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
  })
);

// Fetch all payments of an order
app.get(
  '/api/order/:orderId/payments',
  asyncHandler(async (req, res) => {
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
  })
);

// Capture an authorized payment
app.post(
  '/api/payment/capture',
  asyncHandler(async (req, res) => {
    const { paymentId, amount } = req.body;

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
  })
);

// Fetch a payment by id
app.get(
  '/api/payment/:paymentId',
  asyncHandler(async (req, res) => {
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
  })
);

// Fetch all payments

// Fetch card details of a payment

// Refund a payment

app.listen(config.PORT, () => console.log(`Server is running on http://localhost:${config.PORT}`));
