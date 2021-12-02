import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MetadataNFTController } from './metadatanft.controller'
import { MetadataNFTRepository } from './metadataNFT.repository'
import { MetadataNFTService } from './metadatanft.service'

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([MetadataNFTRepository])],
  controllers: [MetadataNFTController],
  providers: [MetadataNFTService],
})
export class MetadataNFTModule {}
