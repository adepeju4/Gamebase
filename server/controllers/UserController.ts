import User from '../models/Auth.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import validateFields, { createError } from '../utils/validateFields.js';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { generateToken } from '../utils/jwt.js';
import { UserStatus } from '../types/enums.js';

dotenv.config();

interface SignUpBody {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
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
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  conversations?: any[];
  status?: string;
  profileImage?: string;
  lastActive?: Date;
  unreadMessages?: number;
}

const AuthController = {
  SignUp: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, userName, email, password } = req.body as SignUpBody;

      const validationResult = validateFields('signup', {
        firstName,
        lastName,
        userName,
        email,
        password,
      });

      if (validationResult.length) {
        return next(createError(validationResult));
      } else {
        const userExists = await User.findOne({ userName });
        const emailExists = await User.findOne({ email });

        if (userExists) {
          return next(createError('User already exists!'));
        }

        if (emailExists) {
          return next(createError('Email already in use!'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        const token = generateToken({
          userId,
          userName,
          email,
        });

        const user = {
          firstName,
          lastName,
          userName,
          email,
          password: hashedPassword,
          userId,
          status: UserStatus.Online,
          lastActive: new Date(),
        };

        const createdUser = await User.create(user);

        res.locals.user = {
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          userName: createdUser.userName,
          email: createdUser.email,
          userId: createdUser.userId,
          token,
          status: createdUser.status,
          profileImage: createdUser.profileImage,
          lastActive: createdUser.lastActive,
          unreadMessages: 0,
        };

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
        const userExists = (await User.findOne({ userName }).populate({
          path: 'conversations',
          select: 'name isGroup participants lastActivity lastMessage',
          populate: {
            path: 'lastMessage',
            select: 'content timestamp sender',
          },
        })) as UserDocument | null;

        if (!userExists) {
          return next(createError('User not found!'));
        }

        const dbPasswordMatch = await bcrypt.compare(password, userExists.password);

        if (!dbPasswordMatch) {
          return next(createError('Password is incorrect'));
        }

        const token = generateToken({
          userId: userExists.userId,
          userName: userExists.userName,
          email: userExists.email,
        });

        await User.updateOne(
          { userName },
          {
            status: UserStatus.Online,
            lastActive: new Date(),
          }
        );

        res.locals.user = {
          firstName: userExists.firstName,
          lastName: userExists.lastName,
          userName: userExists.userName,
          email: userExists.email,
          userId: userExists.userId,
          token,
          conversations: userExists.conversations || [],
          status: UserStatus.Online,
          profileImage: userExists.profileImage,
          lastActive: new Date(),
          unreadMessages: userExists.unreadMessages || 0,
        };

        return next();
      }
    } catch (error) {
      return next(createError(error));
    }
  },

  getUserProfile: async function (_: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.userId;

      const user = await User.findOne({ userId }).populate({
        path: 'conversations',
        select: 'name isGroup participants lastActivity lastMessage',
        populate: {
          path: 'lastMessage',
          select: 'content timestamp sender',
        },
      });

      if (!user) {
        return next(createError('User not found'));
      }

      res.locals.userProfile = {
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        userId: user.userId,
        conversations: user.conversations || [],
        status: user.status,
        profileImage: user.profileImage,
        lastActive: user.lastActive,
        unreadMessages: user.unreadMessages || 0,
      };

      return next();
    } catch (error) {
      return next(createError(error));
    }
  },

  updateUserProfile: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.userId;
      const { firstName, lastName, profileImage, status } = req.body;

      const updateData: any = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (profileImage) updateData.profileImage = profileImage;
      if (status) updateData.status = status;

      const updatedUser = await User.findOneAndUpdate({ userId }, updateData, {
        new: true,
      }).populate({
        path: 'conversations',
        select: 'name isGroup participants lastActivity lastMessage',
        populate: {
          path: 'lastMessage',
          select: 'content timestamp sender',
        },
      });

      if (!updatedUser) {
        return next(createError('User not found'));
      }

      res.locals.userProfile = {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userName: updatedUser.userName,
        email: updatedUser.email,
        userId: updatedUser.userId,
        conversations: updatedUser.conversations || [],
        status: updatedUser.status,
        profileImage: updatedUser.profileImage,
        lastActive: updatedUser.lastActive,
        unreadMessages: updatedUser.unreadMessages || 0,
      };

      return next();
    } catch (error) {
      return next(createError(error));
    }
  },

  updateUserStatus: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.user.userId;
      const { status } = req.body as { status: UserStatus };

      if (!Object.values(UserStatus).includes(status)) {
        return next(createError('Invalid status value'));
      }

      const updatedUser = await User.findOneAndUpdate(
        { userId },
        {
          status,
          lastActive: new Date(),
        },
        { new: true }
      );

      if (!updatedUser) {
        return next(createError('User not found'));
      }

      res.locals.status = {
        userId: updatedUser.userId,
        status: updatedUser.status,
        lastActive: updatedUser.lastActive,
      };

      return next();
    } catch (error) {
      return next(createError(error));
    }
  },
};

export default AuthController;
