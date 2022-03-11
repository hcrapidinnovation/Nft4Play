import { EntityRepository, Repository } from 'typeorm'
import { CowCardMetadataNFT as CardMetadataNFT } from './cow-card.entity'
import { IArrayUpdates, IMetadataNFT } from './cow-card.interface'

@EntityRepository(CardMetadataNFT)
export class CowCardMetadataNFTRepository extends Repository<CardMetadataNFT> {
  async findMetadataNFT(match: IMetadataNFT): Promise<CardMetadataNFT> {
    return this.findOne({ where: match })
  }

  async findMetadataNFTDuplicate(nftIds: number[]): Promise<CardMetadataNFT[]> {
    const query = this.createQueryBuilder('metadataNFT')
    const result = await query
      .where('metadataNFT.nftId IN (:...nftIds)', { nftIds })
      .getMany()
    return result
  }

  async createMetadataNFT(metadataNFT: IMetadataNFT): Promise<CardMetadataNFT> {
    const newMetadataNFT = this.create(metadataNFT)
    await this.save(newMetadataNFT)
    return newMetadataNFT
  }

  async bulkCreate(dataArr: IMetadataNFT[]): Promise<any> {
    const query = this.createQueryBuilder('metadataNFT')
    const metadataNFTArr = await query
      .insert()
      .into(CardMetadataNFT)
      .values(dataArr)
      .execute()
    return metadataNFTArr
  }

  async updateMetadataNFT(
    nftId: number,
    updates: IMetadataNFT,
    attrUpdates?: IArrayUpdates,
  ): Promise<CardMetadataNFT> {
    const metadataNFT = await this.findOne({
      where: { nftId },
    })

    if (!metadataNFT) {
      return null
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

    if (!metadataNFT.attributes && attrUpdates.add) {
      metadataNFT.attributes = attrUpdates.add
    } else if (attrUpdates.add) {
      metadataNFT.attributes = [...metadataNFT.attributes, ...attrUpdates.add]
    }

    const keys = Object.keys(updates)
    keys.forEach((key) => {
      metadataNFT[key] = updates[key]
    })

    return await this.save(metadataNFT)
  }

  async deleteMetadataNFT(id: number): Promise<boolean> {
    const result = await this.delete({ nftId: id })

    if (result.affected === 0) {
      return false
    }

    return true
  }
}
