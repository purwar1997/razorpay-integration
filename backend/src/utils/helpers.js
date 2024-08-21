import crypto from 'crypto';

export const sendResponse = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const generateHmacSha256 = (message, key) =>
  crypto.createHmac('sha256', key).update(message).digest('hex');

export const roundTwoDecimals = value => Math.round(value * 100) / 100;
