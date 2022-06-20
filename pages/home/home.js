import {nowtime} from '../../utils/utils';
Page({
  data: {
    iconList: [{
      imgurl: '/asstes/img/index/doping.png',
      name: '拒绝掺杂'
    }, {
      imgurl: '/asstes/img/index/weight.png',
      name: '单次3KG起'
    }, {
      imgurl: '/asstes/img/index/water.png',
      name: '拒绝掺水'
    }],
    basicsList: [{
      icon: 'phone',
      name: '在线预约'
    }, {
      icon: 'deliver',
      name: '免费上门'
    }, {
      icon: 'calendar',
      name: '订单完成'
    }, {
      icon: 'sponsor',
      name: '用户提现'
    }],
    time: nowtime('yyyy-MM-dd hh:mm'),
    msg:["只*预约成功","喵*预约成功","时*预约成功","爱*预约成功","龙*预约成功","李*预约成功","露*预约成功","A*预约成功","Per*预约成功","虫*预约成功"],
    question:false
  },
  go() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  question() {
    this.setData({
      question:!this.data.question
    })
  }
})
