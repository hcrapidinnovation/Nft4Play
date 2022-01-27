import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MedalMetadataNFTController } from './medalMetadataNFT.controller'
import { MedalMetadataNFTRepository } from './medalMetadataNFT.repository'
import { MedalMetadataNFTService } from './medalMetadataNFT.service'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([MedalMetadataNFTRepository]),
  ],
  controllers: [MedalMetadataNFTController],
  providers: [MedalMetadataNFTService],
  exports: [MedalMetadataNFTService],
})
export class MedalMetadataNFTModule {}
