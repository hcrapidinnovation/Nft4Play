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
import {
  CreateMetadataNFTDto,
  UpdateMetadataNFTDto,
} from '../common/commonMetadataNFT.dto'
import { CowMedalMetadataNFT as MedalMetadataNFT } from './cow-medal.entity'
import { IOpenSeaMetadata } from '../constants/interface/metadataNFT.interface'
import { CowMedalService } from './cow-medal.service'

@Controller('cow/medal')
export class CowMedalController {
  constructor(private readonly metadataNFTService: CowMedalService) {}

  // @Get('metadata/:batchId.json')
  // async getOpenSeaMetadata(
  //   @Param('batchId', ParseIntPipe) batchId: number,
  // ): Promise<IOpenSeaMetadata | unknown> {
  //   return this.metadataNFTService.getOpenSeaMetadata(batchId)
  // }

  // @Get('metadata/internal/:batchId.json')
  // async getOpenSeaMetadataInternal(
  //   @Param('batchId', ParseIntPipe) batchId: number,
  // ): Promise<IOpenSeaMetadata | unknown> {
  //   return this.metadataNFTService.getOpenSeaMetadataInternal(batchId)
  // }

  // @Post('/:secret')
  // async createMetadataNft(
  //   @Param('secret') secret: string,
  //   @Body() createDto: CreateMetadataNFTDto,
  // ): Promise<MedalMetadataNFT> {
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
  // ): Promise<MedalMetadataNFT> {
  //   return this.metadataNFTService.updateMetadataNft(secret, updateDto)
  // }
}
