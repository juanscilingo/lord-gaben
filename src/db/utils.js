export const scan = async params => {
  let items = [];
  let last_evaluated_key;

  while (true) {
    params.ExclusiveStartKey = last_evaluated_key;
    const data = await global.db.scan(params).promise();
    last_evaluated_key = data.LastEvaluatedKey;
    items = [...items, ...data.Items]

    if (!last_evaluated_key)
      break;
  }

  return items;
}