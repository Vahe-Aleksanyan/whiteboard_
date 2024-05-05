import { DatabaseModule } from '@lib/database';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

// import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, AuthModule],
})
export class AdminApiModule {}
