let userTokens = {};

export function saveUserToken(userId, tokenData) {
  userTokens[userId] = tokenData;
}

export function getUserToken(userId) {
  return userTokens[userId];
}

export function deleteUserToken(userId) {
  delete userTokens[userId];
}
