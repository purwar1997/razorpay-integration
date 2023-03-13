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
      throw new Error('Please provide an order amount');
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
    const orders = await razorpay.orders.all({ 'expand[]': ['payments', 'payments.card'] });

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
      throw new Error('Please provide an order id');
    }

    const order = await razorpay.orders.fetch(orderId);

    res.status(200).json({
      success: true,
      message: 'Order successfully fetched',
      order,
    });
  })
);

// Fetch all payments for an order
app.get(
  '/api/order/:orderId/payments',
  asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
      throw new Error('Please provide an order id');
    }

    const payments = await razorpay.orders.fetchPayments(orderId);

    res.status(200).json({
      success: true,
      message: `Payments successfully fetched for order ${orderId}`,
      payments,
    });
  })
);

app.listen(config.PORT, () => console.log(`Server is running on http://localhost:${config.PORT}`));
