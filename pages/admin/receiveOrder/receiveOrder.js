// pages/admin/receiveOrder/receiveOrder.js
Page({
  data: {
    TabCur: 0,//0,1,2 分别代表当前为'待接单','进行中','已完成'
    list: ['待接单','进行中','已完成'],
    dataList: [[],[],[]]
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
  },
  get(i, order) {
    let oldLen = this.data.dataList[i].length
    wx.cloud.database().collection(order)
    .skip(oldLen)
    .get()
    .then(res => {
      let f = 'dataList[' + i + ']'
      this.setData({
        [f]: this.data.dataList[i].concat(res.data)
      })
      let len = this.data.dataList[i].length
      if(len == oldLen) {//拿到全部数据
        wx.showToast({
          icon: 'success',
          title: '加载成功'
        })
      } else {
        this.get(i, order)
      }
    })
  },
  acceptOrder(e) {
    let id = this.data.dataList[this.data.TabCur][e.currentTarget.dataset.index]._id
    if (this.data.TabCur == 0){
      let data = this.data.dataList[this.data.TabCur][e.currentTarget.dataset.index]
      const product = {}
      product.name = data.name
      product.tel = data.tel
      product.weight = data.weight
      product.address = data.address
      product.category = data.category
      product.date = data.date
      product.userOpenID = data._openid
      Promise.all([
        wx.cloud.database().collection('waitOrder').doc(id).remove(), //在待接单的数据库里删除
        wx.cloud.database().collection('conductOrder').add({data: product}) //在进行中的数据库里添加
      ]).then(all => {
        this.data.dataList[0].splice(e.currentTarget.dataset.index, 1);
        this.setData({//使用这个才能实现数据实时变化，无语。。。。。
          dataList: this.data.dataList
        })
        this.get(1,'conductOrder')
      })
    } else if(this.data.TabCur == 1){
      wx.redirectTo({
        url: './detail?id='+JSON.stringify(id)
      })
    }
  },
  onLoad(options) {
    wx.showLoading({  // 显示加载中loading效果 
      title: "加载中",
      mask: true  //开启蒙版遮罩
    })
    this.get(0,'waitOrder')
    this.get(1,'conductOrder')
    this.get(2,'finishOrder')
  }
})