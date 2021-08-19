export interface SlackConfig {
  webhookUrl: string;
}

export const config: SlackConfig = {
  webhookUrl: process.env.OMSCENTRAL_SLACK_WEBHOOK_URL || '',
};
