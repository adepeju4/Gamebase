import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connection.on('disconnected', () => {
  console.warn(`lost database connection`);
});

mongoose.connection.on('reconnect', () => {
  console.log('-> database reconnected');
});

mongoose.connection.on('error', (error) => {
  console.error(`Could not connect because of ${error}`);
  process.exit(-1);
});

const startDB = () => {
  const connectionString = process.env.CONNECT_API;
  if (!connectionString) {
    console.error('CONNECT_API environment variable is not defined');
    process.exit(-1);
  }
  
  mongoose.connect(connectionString);
  mongoose.connection.on('connected', () => {
    console.log('Database connected');
  });
};

export default startDB;
