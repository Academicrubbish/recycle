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
    openID: [],
    goodsList: [[],[],[],[]],
    inputData: ''
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
  },
  add(e) {
    wx.showModal({
      title: '新建商品',
      content: '',
      placeholderText: '输入回收商品名',
      editable: true
    }).then(res => {
      if(res.confirm){
        const product = {};
        product.name = res.content;
        product.price = 0
        this.data.goodsList[this.data.TabCur].push(product);
        // console.log(this.data.goodsList)
        this.setData({//使用这个才能实现数据实时变化，无语。。。。。
          goodsList: this.data.goodsList
        })
      }
    })
  },
  update(e) {
    wx.showModal({
      title: '修改价格',
      content: '',
      placeholderText: '只能输入数字，不然会出错',
      editable: true
    }).then(res => {
      if(res.confirm){
        this.data.goodsList[this.data.TabCur][e.currentTarget.dataset.index].price = res.content*1;
        this.setData({//使用这个才能实现数据实时变化，无语。。。。。
          goodsList: this.data.goodsList
        })
      }
    })
  },
  remove(e) {
    this.data.goodsList[this.data.TabCur].splice(e.currentTarget.dataset.index, 1);
    // console.log(this.data.goodsList[this.data.TabCur])

    this.setData({//使用这个才能实现数据实时变化，无语。。。。。
      goodsList: this.data.goodsList
    })
  },
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
        for(var i=0;i<4;i++){
          var database = ''
          if(i==0) database = 'fabric'
          else if(i==1) database = 'metal'
          else if(i==2) database = 'paper'
          else database = 'plastic'

          wx.cloud.database().collection('product').doc(this.data.openID[i]).update({
            data: {
              [database]: this.data.goodsList[i]
            }
          })
        }
        if (i == 4) {
          wx.showToast({
            icon: 'success',
            title: '保存成功'
          })
        }
      }
    })
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
        let o = 'openID[' + i + ']';
        this.setData({
          [o]: res.data[i]._id,//保存id以供保存更改
          [f]: res.data[i][database]
        })
      }
    })  
  }
})