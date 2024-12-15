import mongoose from 'mongoose';

import Player from './player';
import Lineup from './lineup';

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, });
};

const models = { Player, Lineup };

export { connectDb };

export default models;
