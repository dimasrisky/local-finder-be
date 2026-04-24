import { MigrationInterface, QueryRunner } from "typeorm";

export class InisiasiLocation1777020813466 implements MigrationInterface {
    name = 'InisiasiLocation1777020813466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "createdBy" character varying, "updatedBy" character varying, "deletedBy" character varying, "name" character varying NOT NULL, "search_query" character varying NOT NULL, "total_items" integer NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "location_item" ADD "locationId" integer`);
        await queryRunner.query(`ALTER TABLE "location_item" ADD CONSTRAINT "FK_312fe72f8d91cd39115c2f84a41" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location_item" DROP CONSTRAINT "FK_312fe72f8d91cd39115c2f84a41"`);
        await queryRunner.query(`ALTER TABLE "location_item" DROP COLUMN "locationId"`);
        await queryRunner.query(`DROP TABLE "location"`);
    }
}
