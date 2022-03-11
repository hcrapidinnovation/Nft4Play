import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from 'ormconfig'
import { schema } from './shared/env/env.schema'
import { MedalMetadataNFTModule } from './medal/medalMetadataNFT.module'
import { CardModule } from './card/card.module'
import { CowMedalModule } from './cow-medal/cow-medal.module'
import { CowCardModule } from './cow-card/cow-card.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      validationSchema: schema,
    }),
    TypeOrmModule.forRoot(config),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('THROTTLE_TTL_SEC'),
        limit: config.get<number>('THROTTLE_LIMIT'),
      }),
    }),
    MedalMetadataNFTModule,
    CardModule,
    CowMedalModule,
    CowCardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
