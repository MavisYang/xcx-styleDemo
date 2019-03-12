//app.js
const util = require("utils/util.js")
const API = require('/utils/api.js')

// 小程序启动之后，在 app.js 定义的 App 实例的 onLaunch 回调会被执行:
// 整个小程序只有一个 App 实例，是全部页面共享的，
App({
    onLaunch: function () {
        // 获取Unioid并登陆
        util.getUnioid(this);
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null
    },
    shareIndex: function (titles, paths, urls) {
        let self = this;
        return {
            title: titles,
            path: paths,
            imageUrl: urls, //若不写，则随机截图当前页面,图片宽高有影响，尤其高度
            mask: true,
            success(res) {
                console.log(res)
                wx.showToast({
                    title: '分享成功',
                    icon: 'success',
                    duration: 3000
                })
            }
        }
    },
    // 获取全局属性 用户信息，登录状态
    getGlobalDatas: function (canIUse, callback) {
      let _this = this;
      let userinfos = wx.getStorageSync('userinfo');
      if (userinfos.hasOwnProperty('nickName')) {
        console.log(userinfos, '获取全局属性 用户信息，登录状态');
        callback({
          userInfo: userinfos,
          hasUserInfo: true
        })
      } else {
        console.log('globalData userInfo')
        if (_this.globalData.userInfo) {
          callback({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
        } else if (canIUse) {
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          _this.userInfoReadyCallback = res => {
            callback({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        } else if (!canIUse) {
          console.log("low version")
          wx.showModal({ // 向用户提示升级至最新版微信。
            title: '提示',
            confirmColor: '#F45C43',
            content: '微信版本过低，请升级至最新版。',
            mask: true
          })
        } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
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
    }

})