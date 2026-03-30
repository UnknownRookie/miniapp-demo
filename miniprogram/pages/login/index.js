const { request } = require('../../utils/request');
const { hasLogin, saveLogin } = require('../../utils/auth');

Page({
  data: {
    loading: false
  },

  onShow() {
    if (hasLogin()) {
      this.goToProductDetail();
    }
  },

  async handleLogin() {
    if (this.data.loading) {
      return;
    }

    this.setData({ loading: true });
    wx.showLoading({ title: '登录中' });

    try {
      const loginResult = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        });
      });

      if (!loginResult.code) {
        throw new Error('未获取到微信登录 code');
      }

      const data = await request({
        url: '/auth/wx-login',
        method: 'POST',
        data: {
          code: loginResult.code
        }
      });

      saveLogin(data);
      getApp().globalData.user = data.user;
      this.goToProductDetail();
    } catch (error) {
      wx.showToast({
        title: error.message || '登录失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
      this.setData({ loading: false });
    }
  },

  goToProductDetail() {
    const app = getApp();
    wx.reLaunch({
      url: `/pages/product-detail/index?id=${app.globalData.defaultProductId}`
    });
  }
});
