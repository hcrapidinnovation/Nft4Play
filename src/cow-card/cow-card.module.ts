import { Module } from '@nestjs/common'
import { CowCardService } from './cow-card.service'
import { CowCardController } from './cow-card.controller'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CowCardMetadataNFTRepository } from './cow-card.repository'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([CowCardMetadataNFTRepository]),
  ],
  providers: [CowCardService],
  controllers: [CowCardController],
})
export class CowCardModule {}
