const app = getApp()
import {nowtime} from '../../../utils/utils'
Page({
  data: {
    balance:0,
    withdraw:[],
    addMoney:0,
    todayMoney:0
  },
  onLoad() {
    //1.计算累计的收益
    let sum = 0
    app.globalData.userData.sellHistory.forEach(item => {
      sum += item.price
    })
    //2.计算今日收益
    let date = nowtime("MM-dd")
    let nowSum = 0
    app.globalData.userData.sellHistory.forEach(item => {
      // if(item.date.substring(0,item.date.indexOf(' ')) == date) {//把空格之前日期给截取出来，如果日期等于今天的话，就是今日收益
      //   nowSum += item.price
      // }
      if(item.date == date) {
        nowSum += item.price
      }
    })
    this.setData({
      balance: app.globalData.userData.balance.toFixed(2),
      withdraw: app.globalData.userData.sellHistory,
      addMoney: sum.toFixed(2),
      todayMoney: nowSum.toFixed(2)
    })
  },
  withdraw() {
    wx.showModal({
      title: '提现功能尚未开发完全',
      content: '用户可以前往 联系我们 页面向客服发收款码提现噢',
    })
  }
})