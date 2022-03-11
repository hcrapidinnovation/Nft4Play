import { Module } from '@nestjs/common'
import { CowMedalService } from './cow-medal.service'
import { CowMedalController } from './cow-medal.controller'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CowMedalMetadataNFTRepository } from './cow-medal.repository'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([CowMedalMetadataNFTRepository]),
  ],
  providers: [CowMedalService],
  controllers: [CowMedalController],
})
export class CowMedalModule {}
