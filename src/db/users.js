import env from '../env';

export const getUsers = async () => {
  const result = await global.db.scan({
    TableName: env.USERS_TABLE
  }).promise()

  return result.Items;
}