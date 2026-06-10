import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import booksRoutes from './routes/books.js';
import friendsRoutes from './routes/friends.js';
import { env } from './config/env.js';

const app = express();
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

mongoose
  .connect(env.mongoUri)
  .then(() => console.log('Mongo connected'))
  .catch((e) => console.error('Mongo error', e));

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/friends', friendsRoutes);

app.listen(env.port, () => console.log(`API listening on :${env.port}`));
