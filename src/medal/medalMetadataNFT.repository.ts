import { EntityRepository, Repository } from 'typeorm'
import { MedalMetadataNFT } from './medalMetadataNFT.entity'
import { IArrayUpdates, IMetadataNFT } from './medalMetadataNFT.interface'

@EntityRepository(MedalMetadataNFT)
export class MedalMetadataNFTRepository extends Repository<MedalMetadataNFT> {
  async findMetadataNFT(match: IMetadataNFT): Promise<MedalMetadataNFT> {
    return this.findOne({ where: match })
  }

  async findMetadataNFTDuplicate(
    batchIds: number[],
  ): Promise<MedalMetadataNFT[]> {
    const query = this.createQueryBuilder('metadataNFT')
    const result = await query
      .where('metadataNFT.batchId IN (:...batchIds)', { batchIds })
      .getMany()
    return result
  }

  async createMetadataNFT(
    metadataNFT: IMetadataNFT,
  ): Promise<MedalMetadataNFT> {
    const newMetadataNFT = this.create(metadataNFT)
    await this.save(newMetadataNFT)
    return newMetadataNFT
  }

  async bulkCreate(dataArr: IMetadataNFT[]): Promise<any> {
    const query = this.createQueryBuilder('metadataNFT')
    const metadataNFTArr = await query
      .insert()
      .into(MedalMetadataNFT)
      .values(dataArr)
      .execute()
    return metadataNFTArr
  }

  async updateMetadataNFT(
    batchId: number,
    updates: IMetadataNFT,
    attrUpdates?: IArrayUpdates,
  ): Promise<MedalMetadataNFT> {
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
