const app = getApp()
Page({
  data: {
    TabCur: 0,//0,1,2,3 分别代表当前为布料，塑料，金属，纸类
    list: [
      {
        image:'/asstes/img/index/fabric.png',
        name:'布料类'
      },
      {
        image:'/asstes/img/index/metal.png',
        name:'金属类'
      },
      {
        image:'/asstes/img/index/paper.png',
        name:'纸类'
      },
      {
        image:'/asstes/img/index/plastic.png',
        name:'塑料类'
      }
    ],
    goodsList: [[],[],[],[]],
    iconList: [{
      imgurl: '/asstes/img/index/doping.png',
      name: '拒绝掺杂'
    }, {
      imgurl: '/asstes/img/index/weight.png',
      name: '单次3KG起'
    }, {
      imgurl: '/asstes/img/index/water.png',
      name: '拒绝掺水'
    }]
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
    // console.log(e.currentTarget.dataset.id)
  },
  go(){
    if (!app.globalData.condition) { 
      wx.switchTab({
        url: '../profile/profile'
      })
      wx.showToast({
        icon: 'error',
        title: '登陆一下吧'
      })
    } else {
      wx.navigateTo({
        url: './order/order'
      })
    }
  },
  onLoad() {
    wx.cloud.database().collection('product')
    .get()
    .then(res => {
      for(let i=0;i<4;i++){
        var database = ''
        if(i==0) database = 'fabric'
        else if(i==1) database = 'metal'
        else if(i==2) database = 'paper'
        else database = 'plastic'
        let f = 'goodsList[' + i + ']';
        this.setData({
          [f]: res.data[i][database]
        })
      }
    })  
  }
})