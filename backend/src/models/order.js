import mongoose from 'mongoose';
import { roundTwoDecimals } from '../utils/helpers.js';

const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, 'Order ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Order amount is required'],
      min: [1, 'Order amount must be at least ₹1'],
      max: [Number.MAX_SAFE_INTEGER, `Order amount must be at most ₹${Number.MAX_SAFE_INTEGER}`],
      set: roundTwoDecimals,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentId: {
      type: String,
      required: [true, 'Payment ID is required'],
    },
    signature: {
      type: String,
      required: [true, 'Payment signature is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Order', orderSchema);
