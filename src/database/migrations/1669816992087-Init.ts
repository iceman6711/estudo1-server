import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1669816992087 implements MigrationInterface {
    name = 'Init1669816992087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`perfil\` (\`id\` int NOT NULL AUTO_INCREMENT, \`isMasterAdmin\` tinyint NOT NULL DEFAULT 0, \`ativo\` tinyint NOT NULL DEFAULT 1, \`tipo\` enum ('USUARIO', 'EMPRESA') NOT NULL DEFAULT 'USUARIO', \`senha\` varchar(100) NULL, \`email\` varchar(50) NULL, \`nome\` varchar(30) NOT NULL, \`sobrenome\` varchar(30) NOT NULL, \`documento\` varchar(18) NOT NULL, \`rgIe\` varchar(14) NULL, \`fotoPerfil\` varchar(36) NULL, \`dataNascimento\` datetime NULL, \`enderecoCEP\` varchar(9) NULL, \`enderecoLogradouro\` varchar(60) NULL, \`enderecoNumero\` varchar(10) NULL, \`enderecoComplemento\` varchar(30) NULL, \`enderecoBairro\` varchar(40) NULL, \`enderecoCidade\` varchar(40) NULL, \`enderecoEstado\` varchar(2) NULL, \`enderecoReferencia\` varchar(40) NULL, \`telefone\` varchar(15) NULL, \`celular\` varchar(15) NULL, \`ultimoLogin\` datetime NULL, \`dataExclusao\` datetime(6) NULL, \`dataAlteracao\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`dataCadastro\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_81c63b8d9d8b3a3eee9d9c7528\` (\`email\`), UNIQUE INDEX \`IDX_01c3d9d6e43680a1a844fc183b\` (\`fotoPerfil\`), UNIQUE INDEX \`documento\` (\`documento\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`documento\` ON \`perfil\``);
        await queryRunner.query(`DROP INDEX \`IDX_01c3d9d6e43680a1a844fc183b\` ON \`perfil\``);
        await queryRunner.query(`DROP INDEX \`IDX_81c63b8d9d8b3a3eee9d9c7528\` ON \`perfil\``);
        await queryRunner.query(`DROP TABLE \`perfil\``);
    }

}
