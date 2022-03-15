import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import * as fs from 'fs'
import csv from 'csvtojson'
import { Contract } from 'web3-eth-contract'
import { CreateMetadataNFTDto, UpdateMetadataNFTDto } from './cow-card.dto'
import { CowCardMetadataNFT as CardMetadataNFT } from './cow-card.entity'
import { IMetadataNFT, IOpenSeaMetadata } from './cow-card.interface'
import { CowCardMetadataNFTRepository as CardMetadataNFTRepository } from './cow-card.repository'

@Injectable()
export class CowCardService {
  constructor(
    @InjectRepository(CardMetadataNFTRepository)
    private cardContract: Contract,
    private readonly metadataNFTRepository: CardMetadataNFTRepository,
    private readonly configService: ConfigService,
  ) {}

  isNumeric(num: any): boolean {
    return !isNaN(num)
  }

  async getOpenSeaMetadataInternal(
    nftId: number,
  ): Promise<IOpenSeaMetadata | unknown> {
    try {
      const metadataNFT = await this.metadataNFTRepository.findMetadataNFT({
        nftId,
      })
      if (!metadataNFT) {
        return {}
      }

      const { factionNumber, name, image, description, attributes } =
        metadataNFT
      const openSeaAttributes = attributes
        ? attributes.map((attr) => ({
            trait_type: attr.type,
            value: this.isNumeric(attr.value)
              ? parseInt(attr.value.toString())
              : attr.value,
          }))
        : []
      const openSeaMetadata: IOpenSeaMetadata = {
        name,
        factionNumber,
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
      const url = await this.cardContract.methods.ownerOf(nftId);
      if (!url) {
        return {}
      }
      const openSeaMetadata = await this.getOpenSeaMetadataInternal(nftId)
      console.log(openSeaMetadata)
      return openSeaMetadata
    } catch (error: any) {
      return {}
    }
  }

  async findMetadataNFT(nftId: number): Promise<CardMetadataNFT | unknown> {
    try {
      const metadataNFT = await this.metadataNFTRepository.findMetadataNFT({
        nftId,
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
  ): Promise<CardMetadataNFT> {
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
    if (!file) {
      throw new BadRequestException()
    }
    if (secret != this.configService.get('SECRET')) {
      throw new UnauthorizedException()
    }
    const nameArr = file.originalname.split('.')
    const ext = nameArr[nameArr.length - 1]
    if (ext != 'csv') {
      throw new BadRequestException('File must be csv')
    }
    const main = ['nftId', 'factionNumber', 'name', 'image', 'description']
    const check = ['nftId', 'name', 'image']
    const errors = []
    const nftIds = []
    const csvData = await csv().fromFile(file.path)
    let metadataArr = []
    fs.unlinkSync(file.path)
    for (const [row, data] of csvData.entries()) {
      const error = { row: row + 2, issues: [] }
      if (this.isEmptyMetadata(data, check)) {
        error.issues.push('Empty field')
      }
      if (nftIds.includes(data.nftId)) {
        error.issues.push('Duplicate nftId')
      }
      
      if (
        (data.factionNumber.toUpperCase() === 'GDF' ||
          data.factionNumber.toUpperCase() === 'GOLD') &&
        !(data.nftId >= 1 && data.nftId <= 10000)
      ) {
        error.issues.push('Invalid nftId for Gold Card')
      }

      if (
        (data.factionNumber.toUpperCase() === 'SRF' ||
          data.factionNumber.toUpperCase() === 'SILVER') &&
        !(data.nftId >= 10001)
      ) {
        error.issues.push('Invalid nftId for Silver Card')
      }

      if (
        (data.factionNumber.toUpperCase() === 'GDF' ||
          data.factionNumber.toUpperCase() === 'GOLD') &&
        !(data.nftId >= 1 && data.nftId <= 10000)
      ) {
        error.issues.push('Invalid nftId for Gold Card')
      }

      if (
        (data.factionNumber.toUpperCase() === 'SRF' ||
          data.factionNumber.toUpperCase() === 'SILVER') &&
        !(data.nftId >= 10001)
      ) {
        error.issues.push('Invalid nftId for Silver Card')
      }

      nftIds.push(data.nftId)
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
        nftIds,
      )
      if (result.length > 0) {
        return { report: 'Duplicate nft Id present in CSV' }
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
  ): Promise<CardMetadataNFT> {
    if (secret != this.configService.get('SECRET')) {
      throw new UnauthorizedException()
    }
    try {
      const { nftId, factionNumber, name, image, description, add, remove } =
        updateDto
      const obj = await this.metadataNFTRepository.updateMetadataNFT(
        nftId,
        { name, factionNumber, image, description },
        { add, remove },
      )
      return obj
    } catch (error: any) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
