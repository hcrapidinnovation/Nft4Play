import { EntityRepository, Repository } from 'typeorm'
import {
  IArrayUpdates,
  IMetadataNFT,
} from '../constants/interface/metadataNFT.interface'
import { CowMedalMetadataNFT } from './cow-medal.entity'

@EntityRepository(CowMedalMetadataNFT)
export class CowMedalMetadataNFTRepository extends Repository<CowMedalMetadataNFT> {
  async findMetadataNFT(match: IMetadataNFT): Promise<CowMedalMetadataNFT> {
    return this.findOne({ where: match })
  }

  async findMetadataNFTDuplicate(
    batchIds: number[],
  ): Promise<CowMedalMetadataNFT[]> {
    const query = this.createQueryBuilder('metadataNFT')
    const result = await query
      .where('metadataNFT.batchId IN (:...batchIds)', { batchIds })
      .getMany()
    return result
  }

  async createMetadataNFT(
    metadataNFT: IMetadataNFT,
  ): Promise<CowMedalMetadataNFT> {
    const newMetadataNFT = this.create(metadataNFT)
    await this.save(newMetadataNFT)
    return newMetadataNFT
  }

  async bulkCreate(dataArr: IMetadataNFT[]): Promise<any> {
    const query = this.createQueryBuilder('metadataNFT')
    const metadataNFTArr = await query
      .insert()
      .into(CowMedalMetadataNFT)
      .values(dataArr)
      .execute()
    return metadataNFTArr
  }

  async updateMetadataNFT(
    batchId: number,
    updates: IMetadataNFT,
    attrUpdates?: IArrayUpdates,
  ): Promise<CowMedalMetadataNFT> {
    const metadataNFT = await this.findOne({
      where: { batchId },
    })

    if (!metadataNFT) {
      return null
    }

    if (!metadataNFT.attributes && attrUpdates.add) {
      metadataNFT.attributes = attrUpdates.add
    } else if (attrUpdates.add) {
      metadataNFT.attributes = [...metadataNFT.attributes, ...attrUpdates.add]
    }

    if (attrUpdates.remove) {
      metadataNFT.attributes = metadataNFT.attributes.filter(
        (obj: { type: any }) => {
          if (attrUpdates.remove.indexOf(obj.type) === -1) {
            return obj
          }
        },
      )
    }
    const keys = Object.keys(updates)
    keys.forEach((key) => {
      metadataNFT[key] = updates[key]
    })

    return await this.save(metadataNFT)
  }

  async deleteMetadataNFT(id: number): Promise<boolean> {
    const result = await this.delete({ batchId: id })

    if (result.affected === 0) {
      return false
    }

    return true
  }
}
