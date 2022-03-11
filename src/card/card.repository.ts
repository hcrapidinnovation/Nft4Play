import { EntityRepository, Repository } from 'typeorm'
import { UpdateMetadataNFTAttributesDto } from './card.dto'
import { CardMetadataNFT } from './card.entity'
import { IArrayUpdates, IMetadataNFT } from './card.interface'

@EntityRepository(CardMetadataNFT)
export class CardMetadataNFTRepository extends Repository<CardMetadataNFT> {
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

    if (attrUpdates.increment) {
      metadataNFT.attributes.forEach((obj) => {
        if (obj.type === attrUpdates.increment.type) {
          obj.value = `${
            parseInt(attrUpdates.increment.value.toString()) +
            parseInt(obj.value.toString())
          }`
        }
      })
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

  async updateMetadataNftAttributes(
    nftId: number,
    updateAttributeDto: UpdateMetadataNFTAttributesDto,
  ): Promise<CardMetadataNFT> {
    const metadataNFT = await this.findOne({
      where: { nftId },
    })

    if (!metadataNFT) {
      return null
    }

    const {
      cardLevel,
      goalKeeper,
      defence,
      midField,
      attack,
      stamina,
      captaincy,
      gamesPlayed,
      goalsScored,
    } = updateAttributeDto

    if (cardLevel) {
      const cardlevelInc = 1
      for (const key in metadataNFT.attributes) {
        const obj = metadataNFT.attributes[key]
        if (obj.type.toUpperCase() === 'CardLevel'.toUpperCase()) {
          if (parseInt(obj.value as string) + cardlevelInc <= 10) {
            obj.value = parseInt(obj.value as string) + cardlevelInc
          }
          break
        }
      }
    }

    if (goalKeeper) {
      for (const key in metadataNFT.attributes) {
        const obj = metadataNFT.attributes[key]
        if (obj.type.toUpperCase() === 'Goalkeeper'.toUpperCase()) {
          if (parseInt(obj.value as string) + goalKeeper <= 110) {
            obj.value = parseInt(obj.value as string) + goalKeeper
          }
          break
        }
      }
    }

    if (defence) {
      for (const key in metadataNFT.attributes) {
        const obj = metadataNFT.attributes[key]
        if (obj.type.toUpperCase() === 'Defence'.toUpperCase()) {
          if (parseInt(obj.value as string) + defence <= 110) {
            obj.value = parseInt(obj.value as string) + defence
          }
          break
        }
      }
    }

    if (midField) {
      for (const key in metadataNFT.attributes) {
        const obj = metadataNFT.attributes[key]
        if (obj.type.toUpperCase() === 'MidField'.toUpperCase()) {
          if (parseInt(obj.value as string) + midField <= 110) {
            obj.value = parseInt(obj.value as string) + midField
          }
          break
        }
      }
    }

    if (attack) {
      for (const key in metadataNFT.attributes) {
        const obj = metadataNFT.attributes[key]
        if (obj.type.toUpperCase() === 'Attack'.toUpperCase()) {
          if (parseInt(obj.value as string) + attack <= 110) {
            obj.value = parseInt(obj.value as string) + attack
          }
          break
        }
      }
    }

    if (stamina) {
      for (const key in metadataNFT.attributes) {
        const obj = metadataNFT.attributes[key]
        if (obj.type.toUpperCase() === 'Stamina'.toUpperCase()) {
          if (parseInt(obj.value as string) + stamina <= 110) {
            obj.value = parseInt(obj.value as string) + stamina
          }
          break
        }
      }
    }

    if (captaincy) {
      let isUpdated = false
      for (const key in metadataNFT.attributes) {
        const obj = metadataNFT.attributes[key]
        if (obj.type.toUpperCase() === 'Captaincy'.toUpperCase()) {
          obj.value = parseInt(obj.value as string) + captaincy
          isUpdated = true
          break
        }
      }

      if (!isUpdated) {
        const attr = { type: 'Captaincy', value: captaincy }
        metadataNFT.attributes.push(attr)
      }
    }

    if (gamesPlayed) {
      let isUpdated = false
      for (const key in metadataNFT.attributes) {
        const obj = metadataNFT.attributes[key]
        if (
          obj.type.toUpperCase() === 'Games Played'.toUpperCase() ||
          obj.type.toUpperCase() === 'GamesPlayed'.toUpperCase()
        ) {
          obj.value = parseInt(obj.value as string) + gamesPlayed
          isUpdated = true
          break
        }
      }

      if (!isUpdated) {
        const attr = { type: 'GamesPlayed', value: gamesPlayed }
        metadataNFT.attributes.push(attr)
      }
    }

    if (goalsScored) {
      let isUpdated = false
      for (const key in metadataNFT.attributes) {
        const obj = metadataNFT.attributes[key]
        if (
          obj.type.toUpperCase() === 'Goals Scored'.toUpperCase() ||
          obj.type.toUpperCase() === 'GoalsScored'.toUpperCase()
        ) {
          obj.value = parseInt(obj.value as string) + goalsScored
          isUpdated = true
          break
        }
      }

      if (!isUpdated) {
        const attr = { type: 'GoalsScored', value: goalsScored }
        metadataNFT.attributes.push(attr)
      }
    }

    return await this.save(metadataNFT)
  }
}
