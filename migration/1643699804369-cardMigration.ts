import {MigrationInterface, QueryRunner} from "typeorm";

export class cardMigration1643699804369 implements MigrationInterface {
    name = 'cardMigration1643699804369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "card_metadata_nft" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nftId" integer NOT NULL, "factionNumber" character varying NOT NULL, "name" character varying NOT NULL, "image" character varying NOT NULL, "description" character varying, "attributes" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c294f96b83d463233968be6f12a" UNIQUE ("nftId"), CONSTRAINT "PK_879844d4ce1dc3716c99de5fce0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "card_metadata_nft"`);
    }

}
