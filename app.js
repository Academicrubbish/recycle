// app.js
App({
  onLaunch() {//进入小程序第一个执行的函数
    wx.cloud.init({
      env: 'recycle-2g69aoh99da71415'
    })
    //1.navbar相关操作，计算手机上面框框的高度
    // 获取状态栏的高度
    wx.getSystemInfo({
      success: (result) => {
        this.globalData.statusHeight = result.statusBarHeight
      },
    })
    // 获取胶囊的高度和top值
    let menu = wx.getMenuButtonBoundingClientRect()
    let menuTop = menu.top - this.globalData.statusHeight;
    this.globalData.menuHeight = menu.height+menuTop*2

    //2.。。。
  },
  globalData: {//用于存储全局变量
    changeCondition: false
  }
})
