import { MigrationInterface, QueryRunner } from 'typeorm'

export class cowCard1646983838328 implements MigrationInterface {
  name = 'cowCard1646983838328'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "cow_card_metadata_nft" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nftId" integer NOT NULL, "factionNumber" character varying NOT NULL, "name" character varying NOT NULL, "image" character varying NOT NULL, "description" character varying, "attributes" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_75cff8cf1e6f38f6fb06df77a3b" UNIQUE ("nftId"), CONSTRAINT "PK_8218bca220a0aa81879452167a8" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cow_card_metadata_nft"`)
  }
}
