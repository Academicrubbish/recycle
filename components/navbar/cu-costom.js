// 获取应用实例
const app = getApp()

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    isBack: {
      type: [Boolean, String],
      default: false
    }
  },
  data: {
    statusHeight: app.globalData.statusHeight,
    menuHeight: app.globalData.menuHeight
  },
  methods: {
    BackPage() {
      wx.navigateBack({
        delta: 1
      });
    },
    toHome(){
      wx.reLaunch({
        url: '/pages/home/home',
      })
    }
  }
})