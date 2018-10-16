// 使用 cookie 还是 token，目前主流做法是token

// import auth from './cookie';
import { storage } from '@/utils/storage';
import {
  // commonParams,
  headers,
} from '@/config/api/api.config';

// export default cookie;
// export default storage;

const TokenKey = 'd14-token';

function getToken() {
  return storage.get(TokenKey);
}

function setToken(token, time) {
  headers.set({ token });
  if (!token) {
    return removeToken();
  }
  return storage.set(TokenKey, token, time);
}

function removeToken() {
  return storage.remove(TokenKey);
}

export default {
  getToken,
  setToken,
  removeToken,
};
