const storageKeys = require('./utils/storage-keys');

App({
  globalData: {
    apiBaseUrl: 'http://127.0.0.1:3000/api',
    defaultProductId: 1,
    user: null
  },

  onLaunch() {
    const token = wx.getStorageSync(storageKeys.accessToken);
    if (token) {
      this.globalData.token = token;
    }
  }
});
