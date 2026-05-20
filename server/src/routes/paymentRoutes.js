import { Router } from 'express';
import * as payment from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.post('/order', payment.createOrder);
router.post('/verify', payment.verifyPayment);
router.get('/history', payment.getPaymentHistory);
export default router;
