let API = require('./utils/api.js')
let util = require('utils/util.js')
let wxRequest = require('./utils/wxRequest.js')
let AuthProvider = require('./utils/AuthProvider.js')
//app.js
App({
  onLaunch: function () {
    // 微信预登陆
    let _this = this;
  },
  // 全局数据对象
  globalData: {
    userInfo: null
  },

  // 获取全局属性 用户信息，登录状态 用于具体的某一页面中的onLoad中 获取用户信息
  getGlobalDatas: function (canIUse, callback) {
    console.log(canIUse, 'canIUse');
    let _this = this;
    let userinfos = wx.getStorageSync('userinfo');
    if (userinfos.hasOwnProperty('nickName')) {
      console.log(1);
      console.log(userinfos, '获取全局属性 用户信息，登录状态');
      callback({
        userInfo: userinfos,
        hasUserInfo: true
      })
    } else {
      console.log('globalData userInfo')
      if (_this.globalData.userInfo) {
        console.log(2);
        callback({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (canIUse) {
        console.log(3);
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        _this.userInfoReadyCallback = res => {
          callback({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else if (!canIUse) {
        console.log(4);
        console.log("low version")
        wx.showModal({ // 向用户提示升级至最新版微信。
          title: '提示',
          confirmColor: '#F45C43',
          content: '微信版本过低，请升级至最新版。',
          mask: true
        })
      } else {
        console.log(5);
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          withCredentials: true,
          success: res => {
            _this.globalData.userInfo = res.userInfo
            callback({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
            console.log(success)
          }
        })
      }
    }
  },
  // 全局获取用户信息  点击
  getUserInfoAll: function (res, callback) {
    let _this = this;
    console.log('---获取用户信息---', res);
    if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
      wx.showModal({
        title: '用户授权',
        content: '本小程序需用户授权，请重新点击按钮授权。',
        mask: true,
        confirmColor: '#F45C43',
        success: function (res) {
        }
      })
    } else if (res.detail.errMsg == 'getUserInfo:ok') {
      let userInfo = res.detail.userInfo;
      _this.globalData.userInfo = userInfo;
      wx.setStorageSync('userinfo', userInfo);
      callback({
        userInfo: userInfo,
        hasUserInfo: true,
      });
      // 在获取用户信息的同时登陆 点击触发登陆事件
      // _this.wxLogin(res.detail.encryptedData, res.detail.iv)
    }
  },
  // 登陆 获取openid和unionid
  wxLogin: function (encryptedData, iv) {
    wx.login({
      success: function (result) {
        // body... 通过wx.login返回code值
        if (result.code) {
          let params = {
            appid: API.APP_ID,
            code: result.code,
            encryptedData: encryptedData,
            iv: iv
          };
          wxRequest.fetch(API.authLogin, null, params, "POST").then(res => {
            "use strict";
            // console.log()
            if (res.data.resultCode === '100') {
              let openid = res.data.resultContent.openId;
              let unionid = res.data.resultContent.unionId;
              wx.setStorageSync('openid', openid);
              wx.setStorageSync('unionid', unionid);
              AuthProvider.onLogin();
            } else {
              // util.pageGo('/pages/error/index', 1)
            }
          })
        }
      }
    })
  }
})