import { User, UserDocument } from '@lib/database/schemas/user/user.schema';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { MSSendersService } from 'libs/micoservices-clients/senders/ms-senders.service';
import { UpdatePasswordRequestDto } from './dto/update-password-request.dto';
import { UpdateProfileRequestDto } from './dto/update-profile-request.dto';
import { Item, ItemDocument } from '@lib/database/schemas/item/item.schema';
import { ElementsDto } from './dto/elemnets.dto';

@Injectable()
export class UsersService {
  logger = new Logger(UsersService.name);
  constructor(
    @Inject(User.name)
    private userModel: Model<UserDocument>,
    @Inject(Item.name)
    private itemModel: Model<ItemDocument>,
    // private sendersService: MSSendersService,
  ) {}

  async updatePassword(user, body: UpdatePasswordRequestDto) {
    if (user.googleId) {
      throw new HttpException(
        { message: 'Google users can not change password.' },
        400,
      );
    }

    return this.userModel.findByIdAndUpdate(user._id, body);
  }

  async updateProfile(user, body: UpdateProfileRequestDto) {
    if (user.googleId) {
      throw new HttpException(
        { message: 'Google users can not change user info.' },
        400,
      );
    }
    return this.userModel.findByIdAndUpdate(user._id, body);
  }

  async deleteUser(id) {
    return this.userModel.findByIdAndUpdate(id, { isDeleted: true });
  }

  async createItems(body: ElementsDto) {
    const item = new this.itemModel(body);
    return item.save();
  }

  async changeItems(body: ElementsDto) {
    const item = await this.itemModel.findOne().exec();
    item.elements = body.elements;
    return item.save();
  }

  async getItems() {
    return this.itemModel.findOne().exec();
  }
}
