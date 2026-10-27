import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1700000000000 implements MigrationInterface {
  async up(_queryRunner: QueryRunner): Promise<void> {}
  async down(_queryRunner: QueryRunner): Promise<void> {}
}
