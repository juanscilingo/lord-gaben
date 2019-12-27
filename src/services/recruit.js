const PLAYER_LIMIT = 5;

let recruited = [];
let remaining = PLAYER_LIMIT;

const recruitedNames = () => recruited.join(', ');

const currentStatus = () => {
  if (recruited.length === PLAYER_LIMIT)
    return `Sale!! Conectense ${recruitedNames()}`

  if (recruited.length === 0)
    return "Parece que nadie juega"

  return `Tenemos a ${recruitedNames()}. Falta${remaining > 1 ? 'n' : ''} ${remaining}`;
}

export const start = user => {
  recruited = [user];
  remaining = PLAYER_LIMIT - 1;
  return `Vamos que sale! faltan ${remaining}`;
}

export const addUsers = users => {
  if (recruited.length + users.length > PLAYER_LIMIT)
    return "There's too many players";

  for (const user of users) {
    if (recruited.includes(user))
      return "Player is already in...";

    recruited.push(user);
    remaining--;
  }

  return currentStatus();
}

export const removeUsers = users => {
  recruited = recruited.filter(r => !users.includes(r));
  remaining = PLAYER_LIMIT - recruited.length;
  return currentStatus();
}