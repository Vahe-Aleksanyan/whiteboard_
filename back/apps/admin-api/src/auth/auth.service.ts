import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from 'libs/database/src/schemas/user/user.schema';
import { jwtConstants } from 'libs/jwt-auth/src/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserAuthJwtService')
    private jwtService: JwtService,
    @Inject(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async login({ email, password, role }: LoginDto) {
    const user = await this.userModel.findOne({ email, role });
    if (user && user.password && bcrypt.compareSync(password, user.password)) {
      const { access_token, refresh_token } = this.generateTokens(user);
      user.refresh_token = refresh_token;

      await user.save();
      return { access_token, refresh_token };
    } else {
      throw new HttpException(
        { message: 'Неправильный логин или пароль' },
        400,
      );
    }
  }

  private generateTokens(user: UserDocument) {
    const access_token = this.jwtService.sign({
      _id: user._id,
      role: user.role,
    });
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

  findUserById(id) {
    return this.userModel.findById(id);
  }
}
