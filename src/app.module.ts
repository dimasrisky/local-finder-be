import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseValidationPipe } from './common/bases/base.validation';
import { AllExceptionFilter } from './common/bases/exceptions/base.exception';
import { typeOrmConfig } from './database/database';
import { ScraperModule } from './modules/scraper/scraper.module';
import { LocationItemModule } from './modules/location-item/location-item.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => await typeOrmConfig(),
      inject: [],
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number.parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    ScraperModule,
    LocationItemModule,
    UserModule,
    AuthModule,
    DashboardModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_PIPE, useClass: BaseValidationPipe },
  ],
})
export class AppModule {}
