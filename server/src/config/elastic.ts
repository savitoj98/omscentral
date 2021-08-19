export interface ElasticConfig {
  host: string;
}

export const config: ElasticConfig = {
  host: process.env.SEARCHBOX_SSL_URL || process.env.SEARCHBOX_URL || '',
};
