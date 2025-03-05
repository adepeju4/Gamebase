import User from '../models/Auth.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { StreamChat } from 'stream-chat';
import validateFields, { createError } from '../utils/validateFields.js';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

interface SignUpBody {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
}

interface LoginBody {
  userName: string;
  password: string;
}

interface UserDocument {
  _doc: any;
  userId: string;
  password: string;
}

interface StreamUser {
  hashedPassword?: string;
  [key: string]: any;
}

const AuthController = {
  SignUp: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, userName, password } = req.body as SignUpBody;

      const validationResult = validateFields('signup', {
        firstName,
        lastName,
        userName,
        password,
      });

      if (validationResult.length) {
        return next(createError(validationResult));
      } else {
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        const serverClient = StreamChat.getInstance(
          process.env.KEY || '',
          process.env.SECRET || ''
        );
        const token = serverClient.createToken(userId);
        res.locals.user = {
          token,
          userId,
          firstName,
          lastName,
          userName,
          password: hashedPassword,
        };

        await User.create(res.locals.user);

        return next();
      }
    } catch (error) {
      return next(createError(error));
    }
  },

  Login: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { userName, password } = req.body as LoginBody;

      const validationResult = validateFields('login', {
        userName,
        password,
      });

      if (validationResult.length) return next(createError(validationResult));
      else {
        const serverClient = StreamChat.getInstance(
          process.env.KEY || '',
          process.env.SECRET || ''
        );
        const { users } = await serverClient.queryUsers({ name: userName });

        const userExists = await User.findOne({ userName }) as UserDocument | null;
        if (users && userExists) {
          const streamUser = users[0] as unknown as StreamUser;
          
          // Check if hashedPassword exists before comparing
          const streamPasswordMatch = streamUser.hashedPassword ? 
            await bcrypt.compare(password, streamUser.hashedPassword) : 
            false;
          const dbPasswordMatch = await bcrypt.compare(password, userExists.password);
          
          if (streamPasswordMatch && dbPasswordMatch) {
            const token = serverClient.createToken(userExists.userId);
            res.locals.user = { token, ...userExists._doc };
            return next();
          } else {
            next(createError('Password or UserName is incorrrect'));
          }
        } else return next(createError('User not found!'));
      }
    } catch (error) {
      return next(createError(error));
    }
  },
};

export default AuthController;
