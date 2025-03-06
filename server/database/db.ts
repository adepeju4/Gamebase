import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connection.on('disconnected', () => {
  console.warn(`Database connection lost`);
});

mongoose.connection.on('reconnect', () => {
  console.log('Database reconnected');
});

mongoose.connection.on('error', (error) => {
  console.error(`Database connection error: ${error}`);
  process.exit(-1);
});

const startDB = () => {
  const connectionString = process.env.CONNECT_API;
  if (!connectionString) {
    console.error('CONNECT_API environment variable is not defined');
    process.exit(-1);
  }
  
  mongoose.connect(connectionString);
  // Only log database connection in development mode
  if (process.env.NODE_ENV !== 'production') {
    mongoose.connection.on('connected', () => {
      console.log('Database connected');
    });
  }
};

export default startDB;
