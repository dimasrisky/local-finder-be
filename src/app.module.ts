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

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => await typeOrmConfig(),
      inject: [],
    }),
    ScraperModule,
    LocationItemModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_PIPE, useClass: BaseValidationPipe },
  ],
})
export class AppModule {}
