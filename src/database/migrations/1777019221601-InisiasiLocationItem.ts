import { MigrationInterface, QueryRunner } from 'typeorm';

export class InisiasiLocationItem1777019221601 implements MigrationInterface {
  name = 'InisiasiLocationItem1777019221601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "location_item" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "createdBy" character varying, "updatedBy" character varying, "deletedBy" character varying, "title" character varying NOT NULL, "rating" character varying NOT NULL, "address" character varying, "url" character varying, "phone_number" character varying, "google_maps_url" character varying NOT NULL, CONSTRAINT "PK_8b0b13cf02c6b306d75cbf8d640" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "location_item"`);
  }
}
