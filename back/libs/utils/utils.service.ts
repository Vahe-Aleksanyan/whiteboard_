import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from 'libs/database/src/schemas/user/user.schema';
// import { MSSendersService } from 'libs/microservices-clients/senders/ms-senders.service';
import { Model } from 'mongoose';
// import { DILFUZA_USER_ID } from './functions';

@Injectable()
export class UtilsService {
  constructor(
    private readonly configService: ConfigService,
    // private readonly sendersService: MSSendersService,
    @Inject(User.name)
    private userModel: Model<UserDocument>,
  ) {}
  extractFilenameFromURL(url: string) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return decodeURIComponent(pathname.split('/').pop() as string);
  }
  generateCode = (
    {
      min = 0,
      max = 9999,
      isDemo = false,
    }: {
      min?: number;
      max?: number;
      isDemo: boolean;
    } = { isDemo: false, max: 9999, min: 0 },
  ) => {
    const IS_PROD = this.configService.get<string>('IS_PRODUCTION') === 'true';

    return !IS_PROD || isDemo
      ? '1111'
      : String(Math.floor(Math.random() * (max - min)) + min).padStart(4, '0');
  };

  //   async sendDilfuzaPush({ body, title }) {
  //     try {
  //       const user = await this.userModel.findById(DILFUZA_USER_ID);
  //       if (user) {
  //         this.sendersService.sendPushToHr({
  //           pushUserIds: user.pushTokensAll,
  //           body,
  //           title,
  //         });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
}
