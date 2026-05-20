import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Coupon from '../models/Coupon.js';
import { success, error } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createRazorpayOrder, verifyRazorpaySignature, createStripeSession } from '../services/paymentService.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, couponCode, provider = 'razorpay' } = req.body;
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    if (item.type === 'course') {
      const course = await Course.findById(item.itemId);
      if (!course) return error(res, `Course not found: ${item.itemId}`, 404);
      const price = course.discountPrice ?? course.price;
      orderItems.push({ type: 'course', itemId: course._id, title: course.title, price });
      totalAmount += price;
    }
  }

  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, validUntil: { $gte: new Date() } });
    if (coupon) {
      const discount = coupon.discountType === 'percentage'
        ? (totalAmount * coupon.discountValue) / 100
        : coupon.discountValue;
      totalAmount = Math.max(0, totalAmount - discount);
    }
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    coupon: coupon?._id,
    discount: coupon ? orderItems.reduce((s, i) => s + i.price, 0) - totalAmount : 0,
  });

  if (provider === 'razorpay') {
    const razorpayOrder = await createRazorpayOrder(totalAmount, 'INR', order._id.toString());
    return success(res, { order, razorpayOrder, keyId: process.env.RAZORPAY_KEY_ID });
  }

  const session = await createStripeSession(
    orderItems.map((i) => ({
      price_data: { currency: 'inr', product_data: { name: i.title }, unit_amount: i.price * 100 },
      quantity: 1,
    })),
    `${process.env.CLIENT_URL}/payment/success?order=${order._id}`,
    `${process.env.CLIENT_URL}/payment/cancel`,
    { orderId: order._id.toString() }
  );
  success(res, { order, session });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const order = await Order.findById(orderId);
  if (!order || order.user.toString() !== req.user._id.toString()) {
    return error(res, 'Order not found', 404);
  }

  if (process.env.RAZORPAY_KEY_SECRET && !verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return error(res, 'Invalid payment signature', 400);
  }

  const payment = await Payment.create({
    user: req.user._id,
    order: order._id,
    amount: order.totalAmount,
    provider: 'razorpay',
    providerPaymentId: razorpay_payment_id,
    status: 'completed',
    invoiceNumber: `INV-${Date.now()}`,
  });

  order.status = 'completed';
  order.payment = payment._id;
  await order.save();

  for (const item of order.items) {
    if (item.type === 'course') {
      await Enrollment.findOneAndUpdate(
        { user: req.user._id, course: item.itemId },
        { user: req.user._id, course: item.itemId },
        { upsert: true, new: true }
      );
    }
  }

  success(res, { payment, order }, 'Payment verified');
});

export const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort('-createdAt').populate('order');
  success(res, { payments });
});
