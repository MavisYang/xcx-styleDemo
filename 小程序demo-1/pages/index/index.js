//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
     // 获取全局数据，用户头像。。。
    app.getGlobalDatas(this.data.canIUse,res=>{
      'use strict';
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: res.hasUserInfo
      })
    }) 
  },
  getUserInfo: function(e) {
    console.log('click get userinfo',e)
    app.getUserInfoAll(e, res => {
      "use strict";
      this.setData({
        hasUserInfo: res.hasUserInfo,
        userInfo: res.userInfo
      });
    })
  }
})
