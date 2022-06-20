import {nowtime,debounce} from '../../../utils/utils';
const app = getApp()
Page({
  data: {
    name: '',
    tel: '',
    index:'布料类',
    weight: '5KG以内',
    date: '',
    time: '09:00',
    address: '',
    picker: ['布料类', '塑料类', '金属类','纸类'],
    itemList: ['5KG以内', '10KG以内', '20KG以内', '20KG以上']
  },
  WeightChange() {
    wx.showActionSheet({
      itemList: ['5KG以内', '10KG以内', '20KG以内', '20KG以上']
    }).then(res => {
      this.setData({
        weight: this.data.itemList[res.tapIndex]
      })
    })
  },
  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  PickerChange(e) {
    this.setData({
      index: this.data.picker[e.detail.value]
    })
  },
  go: debounce(function() {
    const product = {};
    product.name = this.data.name;
    product.tel = this.data.tel;
    product.category = this.data.index;
    product.weight = this.data.weight;
    product.date = this.data.date + ' ' + this.data.time;
    product.address = this.data.address;

    wx.showModal({
      title: '下单提示',
      content: '信息准确无误吗'
    }).then(res => {
      if (res.confirm) {
        var telPatt = /^1[356789]\d{9}$/
        if (!telPatt.test(this.data.tel)) {
          wx.showToast({
            icon: 'error',
            title: '手机号填写错误'
          })
        } else if (this.data.address.trim() == '') {
          wx.showToast({
            icon: 'error',
            title: '请输入地址'
          })
        }else {
          wx.showLoading({  // 显示加载中loading效果 
            title: "提交中",
            mask: true  //开启蒙版遮罩
          })
          wx.cloud.database().collection('waitOrder').add({
            data: product
          }).then(res => {
            wx.showToast({
              icon: 'none',
              title: '下单成功，切勿重复提交'
            })
          })
        }
      }
    })
  },1500),
  aaa() {}, //双向绑定有bug，要加一个无用函数
  onLoad() {
    this.setData({
      address: app.globalData.userData.address,
      tel: app.globalData.userData.tel,
      name: app.globalData.name,
      date: nowtime('yyyy-MM-dd'),
    })
  }
})