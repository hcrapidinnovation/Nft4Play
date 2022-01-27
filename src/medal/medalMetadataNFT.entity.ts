import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IAttribute } from './medalMetadataNFT.interface'

@Entity()
export class MedalMetadataNFT {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  batchId: number

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
