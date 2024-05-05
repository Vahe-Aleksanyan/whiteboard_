import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
// import { nanoid } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from 'libs/database/src/schemas/user/user.schema';
import { jwtConstants } from 'libs/jwt-auth/src/constants';
import { HOST } from 'libs/config';
import { MSSendersService } from 'libs/micoservices-clients/senders/ms-senders.service';
import {
  EmailToken,
  EmailTokenDocument,
} from '@lib/database/schemas/email-token/email-token.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserAuthJwtService') private jwtService: JwtService,
    @Inject(EmailToken.name)
    private emailTokenModel: Model<EmailTokenDocument>,
    @Inject(User.name)
    private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private sendersService: MSSendersService,
    private usersService: UsersService,
  ) {}

  async login({ phone, email, password, role }: LoginDto) {
    let query;

    if (email) {
      query = { email };
    } else if (phone) {
      query = { phone };
    }

    if (!query) {
      throw new HttpException({ message: 'No login details provided' }, 400);
    }
    const user = await this.userModel.findOne({
      ...query,
      role,
    });

    if (user) {
      if (user.isDeleted) {
        throw new HttpException(
          {
            message: 'The user is deleted',
          },
          400,
        );
      } else if (user.password) {
        if (bcrypt.compareSync(password, user.password)) {
          const { access_token, refresh_token } = this.generateTokens(user);
          user.refresh_token = refresh_token;
          await user.save();
          return { access_token, refresh_token };
        }
      } else {
        throw new HttpException(
          {
            message:
              'The password is not set, please register or reset your password',
          },
          400,
        );
      }
    }

    throw new HttpException({ message: 'Invalid login information' }, 400);
  }

  private generateTokens(user: UserDocument) {
    const access_token = this.jwtService.sign(
      {
        _id: user._id,
        role: user.role,
      },
      {
        expiresIn: '5 days',
      },
    );
    const refresh_token = this.jwtService.sign(
      {
        _id: user._id,
        role: user.role,
      },
      {
        secret: jwtConstants.refresh_secret,

        expiresIn: '30 days',
      },
    );

    return { access_token, refresh_token };
  }

  async register(data: RegisterDto) {
    try {
      let query;
      if (data.email) {
        query = { email: data.email };
      } else if (data.phone) {
        query = { phone: data.phone };
      }

      if (!query) {
        throw new HttpException(
          { message: 'No register details provided' },
          400,
        );
      }

      let user = await this.userModel.findOne({
        ...query,
      });

      if (user) {
        throw new HttpException(
          { message: 'User with this email or phone number already exists' },
          400,
        );
      } else {
        user = await this.userModel.create({
          ...query,
          ...data,
        });
        const { access_token, refresh_token } = this.generateTokens(user);
        user.refresh_token = refresh_token;
        await user.save();
        return { access_token, refresh_token };
      }
    } catch (error) {
      throw error;
    }
  }

  async refresh(token: string) {
    try {
      const { _id } = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.refresh_secret,
      });

      const user = await this.userModel.findById(_id);
      // && user.refresh_token === token
      if (user) {
        const { access_token, refresh_token } = this.generateTokens(user);
        user.refresh_token = refresh_token;
        await user.save();
        return { access_token, refresh_token };
      }
      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://accounts.google.com/o/oauth2/token',
        {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to refresh the access token.');
    }
  }

  async getProfile(token: string) {
    try {
      return axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );

      const expiresIn = response.data.expires_in;

      if (!expiresIn || expiresIn <= 0) {
        return true;
      }
    } catch (error) {
      return true;
    }
  }

  async googleAuth(googleProfile: any) {
    try {
      const existingUser = await this.userModel.findOne({
        googleId: googleProfile.id,
      });

      if (existingUser) {
        const { access_token, refresh_token } =
          this.generateTokens(existingUser);
        existingUser.refresh_token = refresh_token;
        await existingUser.save();
        return { access_token, refresh_token };
      } else {
        const newUser = await this.userModel.create({
          googleId: googleProfile.id,
          email: googleProfile.email,
          firstname: googleProfile.given_name,
          lastname: googleProfile.family_name,
          // password: nanoid(),
          phone: googleProfile.phone_number,
        });

        const { access_token, refresh_token } = this.generateTokens(newUser);
        newUser.refresh_token = refresh_token;
        await newUser.save();
        return { access_token, refresh_token };
      }
    } catch (error) {
      throw error;
    }
  }

  async createEmailToken(email: string) {
    const forgottenPassword = await this.emailTokenModel.findOne({
      email: email,
    });
    if (
      forgottenPassword &&
      (new Date().getTime() - forgottenPassword.createdAt.getTime()) / 60000 <
        15
    ) {
      throw new HttpException(
        { massege: 'RESET PASSWORD. EMAIL SENT RECENTLY' },
        400,
      );
    } else {
      const forgottenPasswordModel =
        await this.emailTokenModel.findOneAndUpdate(
          { email: email },
          {
            email: email,
            newToken: (
              Math.floor(Math.random() * 9000000) + 1000000
            ).toString(),
          },
          { upsert: true, new: true },
        );
      if (forgottenPasswordModel) {
        return forgottenPasswordModel;
      } else {
        throw new HttpException(
          {
            massege: 'LOGIN.ERROR.GENERIC ERROR',
          },
          400,
        );
      }
    }
  }

  private async getForgottenPasswordModel(newToken: string) {
    return await this.emailTokenModel.findOne({ newToken: newToken });
  }

  async sendEmailForgotPassword(email: string) {
    const userFromDb = await this.userModel.findOne({ email: email });
    if (!userFromDb)
      throw new HttpException({ massege: 'LOGIN.USER NOT FOUND' }, 400);

    const tokenModel = await this.createEmailToken(email);

    if (tokenModel && tokenModel.newToken) {
      const mailOptions = {
        to: email,
        subject: 'Frogotten Password',
        text: `${tokenModel.newToken}`,
        html:
          'Hi! <br><br> If you requested to reset your password<br><br>' +
          '<a href=' +
          'http://' +
          HOST.host.url +
          ':' +
          HOST.host.port +
          '/auth/email/reset-password/' +
          tokenModel.newToken +
          '>Click here</a>',
      };
      const sent = await this.sendersService.sendEmail(mailOptions);

      return sent;
    } else {
      throw new HttpException({ message: 'REGISTER.USER NOT REGISTERED' }, 400);
    }
  }

  async resetPassword(body) {
    const forgottenPassword = await this.getForgottenPasswordModel(
      body.newToken,
    );
    if (!forgottenPassword) {
      throw new HttpException(
        { massege: 'Token is not correct or expire' },
        400,
      );
    }
    const user = await this.userModel.findOne({
      email: forgottenPassword.email,
    });
    if (!user) {
      throw new HttpException({ massege: 'LOGIN.USER NOT FOUND' }, 400);
    }
    await this.emailTokenModel.deleteOne({ email: forgottenPassword.email });
    return this.usersService.updatePassword(user, body.newPassword);
  }

  async revokeGoogleToken(token: string) {
    try {
      await axios.get(
        `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }

  findUserById(id) {
    return this.userModel.findById(id);
  }
}
