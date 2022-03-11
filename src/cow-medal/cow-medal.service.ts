import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import fs from 'fs'
import csv from 'csvtojson'
import {
  CreateMetadataNFTDto,
  UpdateMetadataNFTDto,
} from '../common/commonMetadataNFT.dto'
import { CowMedalMetadataNFT as MetadataNFT } from './cow-medal.entity'
import {
  IMetadataNFT,
  IOpenSeaMetadata,
} from '../constants/interface/metadataNFT.interface'
import { CowMedalMetadataNFTRepository } from './cow-medal.repository'

@Injectable()
export class CowMedalService {
  constructor(
    @InjectRepository(CowMedalMetadataNFTRepository)
    private readonly metadataNFTRepository: CowMedalMetadataNFTRepository,
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

  private isEmptyMetadata(data: IMetadataNFT, check: string[]): boolean {
    for (const key in data) {
      if (check.includes(data[key]) && data[key].length <= 0) {
        return true
      }
    }
    return false
  }

  async bulkCreateMetadataNFT(
    secret: string,
    file: Express.Multer.File,
  ): Promise<any> {
    if (secret != this.configService.get('SECRET')) {
      throw new UnauthorizedException()
    }
    const nameArr = file.originalname.split('.')
    const ext = nameArr[nameArr.length - 1]
    if (ext != 'csv') {
      throw new BadRequestException('File must be csv')
    }
    const main = ['batchId', 'name', 'image', 'description']
    const check = ['batchId', 'name', 'image']
    const errors = []
    const batchIds = []
    const csvData = await csv().fromFile(file.path)
    let metadataArr = []
    fs.unlinkSync(file.path)
    for (const [row, data] of csvData.entries()) {
      const error = { row: row + 2, issues: [] }
      if (this.isEmptyMetadata(data, check)) {
        error.issues.push('Empty field')
      }
      if (batchIds.includes(data.batchId)) {
        error.issues.push('Duplicate batchId')
      }
      batchIds.push(data.batchId)
      if (error.issues.length > 0) {
        errors.push(error)
      }

      if (errors.length > 0) {
        if (metadataArr.length > 0) {
          metadataArr = []
        }
        continue
      }

      const metadata: IMetadataNFT = {}
      metadata.attributes = []
      for (const key in data) {
        if (main.includes(key)) {
          metadata[key] = data[key]
        } else {
          metadata.attributes.push({ type: key, value: data[key] })
        }
      }
      metadataArr.push(metadata)
    }

    if (errors.length > 0) {
      return errors
    }
    try {
      const result = await this.metadataNFTRepository.findMetadataNFTDuplicate(
        batchIds,
      )
      if (result.length > 0) {
        return { report: 'Duplicate Batch Id present in CSV' }
      }
      await this.metadataNFTRepository.bulkCreate(metadataArr)
      return { report: 'success' }
    } catch (error: any) {
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
      throw new InternalServerErrorException(error.message)
    }
  }
}
