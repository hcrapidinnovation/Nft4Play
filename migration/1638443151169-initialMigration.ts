import {MigrationInterface, QueryRunner} from "typeorm";

export class initialMigration1638443151169 implements MigrationInterface {
    name = 'initialMigration1638443151169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "metadata_nft" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "batchId" integer NOT NULL, "name" character varying NOT NULL, "image" character varying NOT NULL, "description" character varying, "attributes" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9763c932e653b88b65cd833fa70" UNIQUE ("batchId"), CONSTRAINT "PK_2f11182244c9932e252397922a9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "metadata_nft"`);
    }

}
