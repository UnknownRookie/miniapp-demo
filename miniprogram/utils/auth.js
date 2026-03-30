const storageKeys = require('./storage-keys');

function hasLogin() {
  return Boolean(wx.getStorageSync(storageKeys.accessToken));
}

function saveLogin(payload) {
  wx.setStorageSync(storageKeys.accessToken, payload.token);
  wx.setStorageSync(storageKeys.userInfo, payload.user);
}

function clearLogin() {
  wx.removeStorageSync(storageKeys.accessToken);
  wx.removeStorageSync(storageKeys.userInfo);
}

module.exports = {
  hasLogin,
  saveLogin,
  clearLogin
};
