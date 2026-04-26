import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserRelationToLocation1777194648161 implements MigrationInterface {
  name = 'UpdateUserRelationToLocation1777194648161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "location" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_bdef5f9d46ef330ddca009a8596" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_bdef5f9d46ef330ddca009a8596"`,
    );
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "userId"`);
  }
}
