import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { getRedis } from './config/redis.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { initLiveSocket } from './sockets/liveSocket.js';
import logger from './utils/logger.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const ALLOWED_ORIGINS = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // allow dev flexibility
    }
  },
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions,
});

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 200 : 1000,
  message: { success: false, message: 'Too many requests' },
});
app.use('/api', limiter);

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

initLiveSocket(io);
app.set('io', io);

const start = async () => {
  await connectDB();
  getRedis();
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  logger.error(err);
  process.exit(1);
});

export default app;
