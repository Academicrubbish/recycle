const app = getApp()
import {debounce} from '../../../utils/utils'
Page({
  data: {
    motto:'',
    tel: '',
    address: '',
    modalName: false
  },
  onLoad() {
    this.setData({
      tel: app.globalData.userData.tel,
      motto: app.globalData.userData.motto,
      address: app.globalData.userData.address
    })
  },
  //防抖处理
  changeMotto: debounce(function(a) { //这里不能使用箭头函数，不然拿不到this
    this.setData({
      motto: a[0].detail.value
    })
  },1500),
  changeTel: debounce(function(a) {
    this.setData({
      tel: a[0].detail.value
    })
  }),
  changeAddress: debounce(function(a) {
    this.setData({
      address: a[0].detail.value
    })
  }),
  save() {
    wx.showModal({
      title: '修改提示',
      content: '确定保存更改信息'
    }).then(res => {
      if (res.confirm) {
        wx.showLoading({  // 显示加载中loading效果 
          title: "保存中",
          mask: true  //开启蒙版遮罩
        })
        this.sure()
      }
    })
  },
  sure() {
    wx.cloud.database().collection('users').where({_openid: app.globalData.openid}).update({
      data: {
        address: this.data.address,
        tel: this.data.tel,
        motto: this.data.motto
      }
    }).then(res => {//数据更新成功后，更新移动端信息
      wx.cloud.database().collection('users').where({_openid: app.globalData.openid})
      .get()
      .then(res => {
        app.globalData.userData = res.data[0]
        wx.showToast({
          icon: 'success',
          title: '修改成功'
        })
      })
    })
  },
  onUnload() {
    app.globalData.changeCondition = true
  }
})