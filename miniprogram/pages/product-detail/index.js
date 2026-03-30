const { request } = require('../../utils/request');
const { clearLogin } = require('../../utils/auth');

Page({
  data: {
    product: null,
    user: null,
    loading: true
  },

  onLoad(query) {
    this.productId = query.id || getApp().globalData.defaultProductId;
  },

  onShow() {
    this.loadPageData();
  },

  async loadPageData() {
    this.setData({ loading: true });
    wx.showLoading({ title: '加载中' });

    try {
      const [user, product] = await Promise.all([
        request({ url: '/me', authRequired: true }),
        request({ url: `/products/${this.productId}`, authRequired: true })
      ]);

      this.setData({
        user,
        product,
        loading: false
      });
    } catch (error) {
      if (error && error.message) {
        wx.showToast({
          title: error.message,
          icon: 'none'
        });
      }
      this.setData({ loading: false });
    } finally {
      wx.hideLoading();
    }
  },

  async handleLogout() {
    try {
      await request({
        url: '/auth/logout',
        method: 'POST',
        authRequired: true
      });
    } catch (error) {
      // Ignore logout failure and clear client state directly.
    }

    clearLogin();
    wx.reLaunch({
      url: '/pages/login/index'
    });
  }
});
