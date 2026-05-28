import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStatusLocation1779939462046 implements MigrationInterface {
  name = 'UpdateStatusLocation1779939462046';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."location_status_enum" AS ENUM('processing', 'done', 'failed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD "status" "public"."location_status_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."location_status_enum"`);
  }
}
