import { PgConnectionConfig } from 'knex';

export interface PostgresConfig extends PgConnectionConfig {
  connectionString: string;
}

export const config: PostgresConfig = {
  connectionString:
    process.env.OMSCENTRAL_POSTGRES_CONNECTION ||
    process.env.DATABASE_URL ||
    '',
};

if (!config.connectionString) {
  throw new Error(
    'process.env.OMSCENTRAL_POSTGRES_CONNECTION || process.env.DATABASE_URL required',
  );
}

if (config.connectionString.includes('@localhost:')) {
  config.ssl = false;
} else {
  config.ssl = {
    rejectUnauthorized: false,
  };
}
