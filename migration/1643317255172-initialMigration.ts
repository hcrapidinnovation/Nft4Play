import { MigrationInterface, QueryRunner } from 'typeorm'

export class initialMigration1643317255172 implements MigrationInterface {
  name = 'initialMigration1643317255172'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "medal_metadata_nft" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "batchId" integer NOT NULL, "name" character varying NOT NULL, "image" character varying NOT NULL, "description" character varying, "attributes" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6282992dc96a43b3aa6ca9cb417" UNIQUE ("batchId"), CONSTRAINT "PK_a96d3fcd71ae76afc33e04a4579" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "medal_metadata_nft"`)
  }
}
