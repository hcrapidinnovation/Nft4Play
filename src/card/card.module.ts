import { Module } from '@nestjs/common'
import { CardService } from './card.service'
import { CardController } from './card.controller'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CardMetadataNFTRepository } from './card.repository'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([CardMetadataNFTRepository]),
  ],
  providers: [CardService],
  controllers: [CardController],
})
export class CardModule {}
