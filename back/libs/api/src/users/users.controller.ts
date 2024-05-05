import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { Lean } from 'libs/utils/decorator/lean.decorator';
import { UserProfileDto } from './dto/user-profile.dto';
import { UpdatePasswordRequestDto } from './dto/update-password-request.dto';
import { CurrentUser } from 'libs/utils/decorator/user.decorator';
import { UserGuard } from 'libs/guards/roles.guard';
import { User } from '@lib/database/schemas/user/user.schema';
import { UpdateProfileRequestDto } from './dto/update-profile-request.dto';
import { ElementsDto } from './dto/elemnets.dto';

// @UserGuard()
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/me/password')
  @Lean(UserProfileDto)
  async me_password(
    @Body() body: UpdatePasswordRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.updatePassword(user, body);
  }

  @Put('/me')
  @Lean(UserProfileDto)
  async update_profile(
    @Body() body: UpdateProfileRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.updateProfile(user, body);
  }

  @Delete('/me')
  async delete_user(@CurrentUser('_id') _id: string) {
    return this.usersService.deleteUser(_id);
  }

  @Post('/create')
  async createItems(@Body() body: ElementsDto) {
    return this.usersService.createItems(body);
  }

  @Put('/change')
  async changeItems(@Body() body: ElementsDto) {
    console.log(body);

    return this.usersService.changeItems(body);
  }

  @Get('/get')
  async getItems() {
    return this.usersService.getItems();
  }
}
