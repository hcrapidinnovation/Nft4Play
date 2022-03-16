import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerStoragePath } from 'src/shared/multer/storage.multer'
import { CreateMetadataNFTDto, UpdateMetadataNFTDto } from './cow-card.dto'
import { CowCardMetadataNFT as CardMetadataNFT } from './cow-card.entity'
import { IOpenSeaMetadata } from './cow-card.interface'
import { CowCardService as CardService } from './cow-card.service'

@Controller('cow/card')
export class CowCardController {
  constructor(private readonly metadataNFTService: CardService) {}

  // @Get('metadata/:nftId.json')
  // async getOpenSeaMetadata(
  //   @Param('nftId', ParseIntPipe) nftId: number,
  // ): Promise<IOpenSeaMetadata | unknown> {
  //   return this.metadataNFTService.getOpenSeaMetadata(nftId)
  // }

  // @Get('metadata/internal/:nftId.json')
  // async getOpenSeaMetadataInternal(
  //   @Param('nftId', ParseIntPipe) nftId: number,
  // ): Promise<IOpenSeaMetadata | unknown> {
  //   return this.metadataNFTService.getOpenSeaMetadataInternal(nftId)
  // }

  // @Post('/:secret')
  // async createMetadataNft(
  //   @Param('secret') secret: string,
  //   @Body() createDto: CreateMetadataNFTDto,
  // ): Promise<CardMetadataNFT> {
  //   return this.metadataNFTService.createMetadataNFT(secret, createDto)
  // }

  // @Post('/upload/csv/:secret')
  // @UseInterceptors(FileInterceptor('csv', multerStoragePath('temp')))
  // async bulkCreateMetadataNFT(
  //   @Param('secret') secret: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<any> {
  //   return this.metadataNFTService.bulkCreateMetadataNFT(secret, file)
  // }

  // @Patch('/:secret')
  // async updateMetadataNft(
  //   @Param('secret') secret: string,
  //   @Body() updateDto: UpdateMetadataNFTDto,
  // ): Promise<CardMetadataNFT> {
  //   return this.metadataNFTService.updateMetadataNft(secret, updateDto)
  // }
}
