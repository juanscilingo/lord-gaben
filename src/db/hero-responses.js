import env from '../env';
import { scan } from './utils';

export const getHeroResponses = async () => {
  const result = await scan({
    TableName: env.HERO_RESPONSES_TABLE
  });

  return result;
}