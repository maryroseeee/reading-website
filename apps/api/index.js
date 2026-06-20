import mongoose from 'mongoose';
import { createApp } from './app.js';
import { env } from './config/env.js';

mongoose
  .connect(env.mongoUri)
  .then(() => console.log('Mongo connected'))
  .catch((e) => console.error('Mongo error', e));

const app = createApp();

app.listen(env.port, () => console.log(`API listening on :${env.port}`));
