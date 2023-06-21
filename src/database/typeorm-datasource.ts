import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

function envPriorityOrigin(key: string): any {

	const filePath = `${process.env.NODE_ENV || 'development'}.env`

	const envConfig = dotenv.parse(fs.readFileSync(filePath))

	const env = process.env[key] !== undefined ? process.env[key] : envConfig[key];

	if (env === undefined) {
		throw new Error('Variável de ambiente "' + key + '" inexistente.');
	}

	return env;

}

// USADO APENAS PARA MIGRATIONS
const options: MysqlConnectionOptions = {
  type: envPriorityOrigin('TYPEORM_CONNECTION'),
  host: envPriorityOrigin('TYPEORM_HOST'),
  port: envPriorityOrigin('TYPEORM_PORT'),
  username: envPriorityOrigin('TYPEORM_USERNAME'),
  password: envPriorityOrigin('TYPEORM_PASSWORD'),
  database: envPriorityOrigin('TYPEORM_DATABASE'),
  dropSchema: false,
  synchronize: false,
  migrationsRun: false,
  extra: {
    trustServerCertificate: true,
  },   
  logging: true, // TypeORM true, false, ['query', 'error', 'schema', 'warn', 'info', 'log']
  logger: 'advanced-console', // TypeORM 'advanced-console' (default), 'simple-console', 'file'
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
  
};

export default new DataSource(options);