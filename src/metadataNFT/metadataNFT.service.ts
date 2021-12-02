import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateMetadataNFTDto, UpdateMetadataNFTDto } from './metadataNFT.dto'
import { MetadataNFT } from './metadataNFT.entity'
import { IOpenSeaMetadata } from './metadataNFT.interface'
import { MetadataNFTRepository } from './metadataNFT.repository'

@Injectable()
export class MetadataNFTService {
  constructor(
    @InjectRepository(MetadataNFTRepository)
    private readonly metadataNFTRepository: MetadataNFTRepository,
    private readonly configService: ConfigService,
  ) {}

  async getOpenSeaMetadataInternal(
    batchId: number,
  ): Promise<IOpenSeaMetadata | unknown> {
    try {
      const metadataNFT = await this.metadataNFTRepository.findMetadataNFT({
        batchId,
      })
      if (!metadataNFT) {
        return {}
      }

      const { name, image, description, attributes } = metadataNFT
      const openSeaAttributes = attributes
        ? attributes.map((attr) => ({
            trait_type: attr.type,
            value: attr.value,
          }))
        : []
      const openSeaMetadata: IOpenSeaMetadata = {
        name,
        image,
        description,
        attributes: openSeaAttributes,
      }
      return openSeaMetadata
    } catch (error: any) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async getOpenSeaMetadata(nftId: number): Promise<IOpenSeaMetadata | unknown> {
    try {
      const openSeaMetadata = await this.getOpenSeaMetadataInternal(nftId)
      return openSeaMetadata
    } catch (error: any) {
      return {}
    }
  }

  async findMetadataNFT(batchId: number): Promise<MetadataNFT | unknown> {
    try {
      const metadataNFT = await this.metadataNFTRepository.findMetadataNFT({
        batchId,
      })
      if (!metadataNFT) {
        return {}
      }
      return metadataNFT
    } catch (error: any) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async createMetadataNFT(
    secret: string,
    createDto: CreateMetadataNFTDto,
  ): Promise<MetadataNFT> {
    if (secret != this.configService.get('SECRET')) {
      throw new UnauthorizedException()
    }
    try {
      const obj = await this.metadataNFTRepository.createMetadataNFT(createDto)
      return obj
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException('Duplicate NFT Metadata')
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  async updateMetadataNft(
    secret: string,
    updateDto: UpdateMetadataNFTDto,
  ): Promise<MetadataNFT> {
    if (secret != this.configService.get('SECRET')) {
      throw new UnauthorizedException()
    }
    try {
      const { batchId, name, image, description, add, remove } = updateDto
      const obj = await this.metadataNFTRepository.updateMetadataNFT(
        batchId,
        { name, image, description },
        { add, remove },
      )
      return obj
    } catch (error: any) {
      console.log(error)
      throw new InternalServerErrorException(error.message)
    }
  }
}
