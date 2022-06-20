const app = getApp()
Page({
  data: {
    name:'微信用户',
    imageUrl:'',
    condition: false,
    openPath:['./userData/userData','./bill/bill','./balance/balance','./about/about'],
    motto: '',
    version: ''
  },
  login() {
    //调用微信接口，获取当前用户信息
    wx.getUserProfile({
      desc: '正在登陆',
    })
    .then(res => {
      wx.showLoading({  // 显示加载中loading效果 
        title: "登录中",
        mask: true  //开启蒙版遮罩
      })
      //1.把用户信息存入data
      this.setData({
        name: res.userInfo.nickName,
        imageUrl: res.userInfo.avatarUrl,
        condition: true
      })
      //2.判断用户是否是新用户
      this.main()

      //3.把用户昵称、头像、签名、以及登录状态存在全局变量，供其他界面使用
      app.globalData.name = res.userInfo.nickName
      app.globalData.imageUrl = res.userInfo.avatarUrl
      app.globalData.condition = true
    }).catch(err => {
      wx.showToast({
        icon: 'error',
        title: '登陆失败'
      })
    })
  },
  go(option){
    if (!app.globalData.condition) { 
      wx.showToast({
        icon: 'error',
        title: '还没有登陆噢'
      })
    } else {
      wx.navigateTo({
        url: this.data.openPath[option.currentTarget.id]
      })
    }
  },
  main() {
    //1.拿到用户的openid
    wx.cloud.callFunction({//拿到用户的唯一标识openid去数据库里查找是否存在此用户
      name: 'getOpenid'
    }).then(res => {
      app.globalData.openid = res.result.openid
      //2.利用openid查找
      wx.cloud.database().collection('users').where({_openid: res.result.openid}).get()
      .then(res => {
        //3.1 如果数据库没有这个用户
        if (res.data.length == 0) {
          //把新用户的默认配置信息存入云数据库
          const data = {
            motto: '垃圾就是放错位置的资源',//用户签名
            tel: '',//用户默认手机
            address: '',//用户默认地址
            sellHistory: [],//用户的下单历史
            balance: 0,//用户余额
            manage: false, //默认为普通用户，true就是管理人员
            delivery: false //默认为普通用户，true就是外出回收人员
          }
          wx.cloud.database().collection('users').add({data})
          this.setData({
            motto: data.motto
          })
          app.globalData.userData = data
          //4.登陆成功
          wx.showToast({
            icon: 'success',
            title: '登陆成功'
          })
        } else { //3.2 这个用户存在
          this.setData({
            motto: res.data[0].motto
          })
          app.globalData.userData = res.data[0]
          //4.登陆成功
          // wx.hideLoading();//关闭加载框
          wx.showToast({
            icon: 'success',
            title: '登陆成功'
          })
        }
      })
    })
  },
  checkUpdateVersion() {
    wx.showLoading({  // 显示加载中loading效果 
      title: "登录中",
      mask: true  //开启蒙版遮罩
    })
    //创建 UpdateManager 实例
    const updateManager = wx.getUpdateManager();
    //检测版本更新
    updateManager.onCheckForUpdate(res => {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        //监听小程序有版本更新事件
        updateManager.onUpdateReady(function() {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            }
          })
        })
        updateManager.onUpdateFailed(function() {
          // 新版本下载失败
          wx.showModal({
            title: '已经有新版本咯~',
            content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开呦~',
          })
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '当前已是最新版，无需更新噢~'
        })
      }
    })
  },
  onShow() {
    if(app.globalData.changeCondition) {
      this.setData({
        motto: app.globalData.userData.motto
      })
      app.globalData.changeCondition = false
    }
    this.setData({
      version: wx.getAccountInfoSync().miniProgram.version
    })
  }
})