const app = getApp()
Page({
  data: {
    sellList: [],
    modalName: null
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  go() {
    wx.showModal({
      title: '提示',
      content: '截图回收员信息，前往 联系我们 页面向客服提交投诉',
    })
  },
  onLoad() {
    this.setData({
      sellList: app.globalData.userData.sellHistory
    })
  }
})