const storageKeys = require('./storage-keys');

function request(options) {
  const app = getApp();
  const token = wx.getStorageSync(storageKeys.accessToken);
  const authRequired = Boolean(options.authRequired);

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.apiBaseUrl}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {})
      },
      success(response) {
        const { statusCode, data } = response;

        if (statusCode === 401 && authRequired) {
          wx.removeStorageSync(storageKeys.accessToken);
          wx.removeStorageSync(storageKeys.userInfo);
          wx.showToast({
            title: '登录已失效',
            icon: 'none'
          });
          wx.reLaunch({
            url: '/pages/login/index'
          });
          reject(data);
          return;
        }

        if (statusCode === 401) {
          reject(data || { message: '未授权' });
          return;
        }

        if (statusCode === 403) {
          wx.showToast({
            title: data.message || '暂无权限',
            icon: 'none'
          });
          reject(data);
          return;
        }

        if (statusCode >= 400 || !data || data.code !== 0) {
          reject(data || { message: '请求失败' });
          return;
        }

        resolve(data.data);
      },
      fail(error) {
        reject(error);
      }
    });
  });
}

module.exports = {
  request
};
