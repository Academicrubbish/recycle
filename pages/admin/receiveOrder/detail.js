import {nowtime} from '../../../utils/utils';
const app = getApp();
Page({
  data: {
    id: '',
    list: [],
    date: '',
    goods: '',
    balance: '',
    weight: '',
    time: '',
    userSellHistory: [],
    price: 0
  },
  finish() {
    wx.showModal({
      title: '完成提示',
      content: '请确认信息准确无误'
    }).then(res => {
      if (res.confirm) { //用户点击确认
        if(this.data.goods == '' || this.data.weight == '' || this.data.balance == ''){ //判断内容是否填写
          wx.showToast({
            icon: 'error',
            title: '信息没有填写完全'
          })
        } else { //填写完全
          wx.showLoading({  // 显示加载中loading效果 
            title: "更新数据中",
            mask: true  //开启蒙版遮罩
          })
          const product = {}
          if(this.data.time > 19) {
            product.color = 'purple'
            product.period = '晚上'
          } else if(this.data.time > 12) {
            product.color = 'blue'
            product.period = '下午'
          } else {
            product.color = 'cyan'
            product.period = '上午'
          }
          product.bigName = this.data.list.category+'回收';
          product.count = this.data.weight+'kg';
          product.date = this.data.date.substring(5, 10);
          product.price = this.data.balance*1;
          product.smallName = this.data.goods;
          product.time = this.data.date.substring(11, 16);

          let userSellHistory = this.data.userSellHistory

          userSellHistory.push(product) //把用户卖出的东西记录下来
          this.data.price += this.data.balance*1
          wx.cloud.database().collection('users').where({_openid: this.data.list.userOpenID}).update({//更新到下单用户的数据库
            data: {
              balance: this.data.price,
              sellHistory: userSellHistory
            }
          }).then(res => { //将已完成的订单在数据库里删除
            wx.cloud.database().collection('conductOrder').doc(this.data.id).remove()
            .then(res => {
              const data = {}
              data.name = this.data.list.name
              data.tel = this.data.list.tel
              data.weight = this.data.list.weight
              data.address = this.data.list.address
              data.category = this.data.list.category
              data.date = this.data.list.date

              wx.cloud.database().collection('finishOrder').add({data})
              wx.showToast({
                icon: 'success',
                title: '更新完成'
              })
              wx.navigateBack({
                delta: 1
              })
            })
          })
        }
      }
    })
  },
  aaa() {}, //双向绑定有bug，要加一个无用函数
  onLoad(options) {
    wx.cloud.database().collection('conductOrder').doc(JSON.parse(options.id))
    .get()
    .then(res => {
      this.setData({
        date: nowtime('yyyy-MM-dd hh:mm'),
        time: nowtime('hh'),
        id: JSON.parse(options.id),
        list: res.data
      })
      wx.cloud.database().collection('users').where({_openid: this.data.list.userOpenID}).get()
      .then(res=> {
        this.setData({
          userSellHistory: res.data[0].sellHistory,
          price: res.data[0].balance
        })
      })
    })
  }
})