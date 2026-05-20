import Razorpay from 'razorpay';
import Stripe from 'stripe';
import crypto from 'crypto';

let razorpay = null;
let stripe = null;

export const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID) return null;
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
};

export const createRazorpayOrder = async (amount, currency = 'INR', receipt) => {
  const rp = getRazorpay();
  if (!rp) {
    return { id: `order_mock_${Date.now()}`, amount: amount * 100, currency, mock: true };
  }
  return rp.orders.create({ amount: amount * 100, currency, receipt });
};

export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expected === signature;
};

export const createStripeSession = async (lineItems, successUrl, cancelUrl, metadata) => {
  const st = getStripe();
  if (!st) {
    return { id: `cs_mock_${Date.now()}`, url: successUrl, mock: true };
  }
  return st.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  });
};
