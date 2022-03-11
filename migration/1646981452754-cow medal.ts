import { MigrationInterface, QueryRunner } from 'typeorm'

export class cowMedal1646981452754 implements MigrationInterface {
  name = 'cowMedal1646981452754'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "cow_medal_metadata_nft" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "batchId" integer NOT NULL, "name" character varying NOT NULL, "image" character varying NOT NULL, "description" character varying, "attributes" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_76cde920712f8af74d05f729540" UNIQUE ("batchId"), CONSTRAINT "PK_4e37d73c8e9df9ea91886517629" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cow_medal_metadata_nft"`)
  }
}
