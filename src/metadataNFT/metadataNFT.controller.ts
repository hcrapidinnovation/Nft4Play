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
import { CreateMetadataNFTDto, UpdateMetadataNFTDto } from './metadataNFT.dto'
import { MetadataNFT } from './metadataNFT.entity'
import { IOpenSeaMetadata } from './metadataNFT.interface'
import { MetadataNFTService } from './metadatanft.service'
@Controller('metadatanft')
export class MetadataNFTController {
  constructor(private readonly metadataNFTService: MetadataNFTService) {}

  @Get('/:batchId.json')
  async getOpenSeaMetadata(
    @Param('batchId', ParseIntPipe) batchId: number,
  ): Promise<IOpenSeaMetadata | unknown> {
    return this.metadataNFTService.getOpenSeaMetadata(batchId)
  }

  @Get('internal/:nftId.json')
  async getOpenSeaMetadataInternal(
    @Param('nftId', ParseIntPipe) nftId: number,
  ): Promise<IOpenSeaMetadata | unknown> {
    return this.metadataNFTService.getOpenSeaMetadataInternal(nftId)
  }

  @Post('/:secret')
  async createMetadataNft(
    @Param('secret') secret: string,
    @Body() createDto: CreateMetadataNFTDto,
  ): Promise<MetadataNFT> {
    return this.metadataNFTService.createMetadataNFT(secret, createDto)
  }

  @Post('/upload/csv/:secret')
  @UseInterceptors(FileInterceptor('csv', multerStoragePath('temp')))
  async bulkCreateMetadataNFT(
    @Param('secret') secret: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.metadataNFTService.bulkCreateMetadataNFT(secret, file)
  }

  @Patch('/:secret')
  async updateMetadataNft(
    @Param('secret') secret: string,
    @Body() updateDto: UpdateMetadataNFTDto,
  ): Promise<MetadataNFT> {
    return this.metadataNFTService.updateMetadataNft(secret, updateDto)
  }
}
