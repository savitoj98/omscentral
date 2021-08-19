import { ping } from '../components';
import { User } from '../models';

export const learnMore = async (
  user: User,
  message: string,
): Promise<boolean> => {
  return ping.info(
    ['```', `${user.name} <${user.email}>`, `${message}`, '```'].join('\n'),
  );
};
