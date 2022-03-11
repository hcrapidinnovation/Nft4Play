import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IAttribute } from './cow-card.interface'

@Entity()
export class CowCardMetadataNFT {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  nftId: number

  @Column()
  factionNumber: string

  @Column()
  name: string

  @Column()
  image: string

  @Column({ nullable: true })
  description: string

  @Column({ type: 'jsonb', nullable: true })
  attributes: IAttribute[]

  @Exclude()
  @CreateDateColumn()
  createdAt: Date

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date
}
