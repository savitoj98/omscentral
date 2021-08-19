import * as Sentry from '@sentry/node';
import { IncomingWebhook } from '@slack/webhook';

import { appConfig, slackConfig } from '../../config';

const webhook = new IncomingWebhook(slackConfig.webhookUrl);

export const info = async (message: string): Promise<boolean> => {
  try {
    await webhook.send({
      text: message,
      icon_emoji: 'information_source',
      username: `Info (${appConfig.name})`,
    });
    return true;
  } catch (error) {
    Sentry.captureException(error, { extra: { message } });
    return false;
  }
};
