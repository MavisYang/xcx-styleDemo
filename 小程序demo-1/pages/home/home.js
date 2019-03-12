var uploadFile = require('../../utils/uploadFile.js')
let util = require('../../utils/util')
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    countIndex: 0,//最多上传图片的数量
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    lenMore: true,
    phone: '18334757882',
    canIUse: wx.canIUse('button.open-type.contact'),
    actionList: ['客服介入', '客服不介入'],
    text: '客服介入',
    animationData: {},
    scrollTop: 0,
    showGoTop: false,
    screenHeight: '',
    // wxml节点信息
    scrollToLeft: 0,
    currentTabIndex: 0,
    categories: [
      { id: Math.random().toString().slice(-11), name: '我是title1' },
      { id: Math.random().toString().slice(-11), name: '我是哈哈title2' },
      { id: Math.random().toString().slice(-11), name: '我是title3' },
      { id: Math.random().toString().slice(-11), name: '我是呀呀呀呀title4' },
    ],
    listItem: {
      teamSize: 2,
      picImg: 'https://cloud.gemii.cc/lizcloud/fs/noauth/media/5af9b15042af930001797241',
      name: '北欧ins火烈鸟装饰画粉红色挂件北欧ins火烈鸟装饰画粉红色火烈鸟装饰画粉红色火烈鸟装饰画粉红色',
      retailPrice: 199,
      showPrice: 158,
      teamNo: 5,
      earnPrice: 15.8,
    }
  },
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    let _this = this;
    // 设置导航条样式动画
    util.setNavigation()
    // 获取系统信息
    _this.setData({
      screenHeight: util.getSystemInfo().screenHeight
    })
    this.queryMultipleNodes()
    // 遍历获取Wxml节点信息
    var categoriesNum = _this.data.categories;
    for (let i = 0; i < categoriesNum.length; i++) {
      var viewId = '#title' + i;
      this.getViewPosition(viewId)
    }
    // 授权
    wx.getSetting({
      success: function (res) {
        console.log(res.authSetting, 'authSetting');
      }
    })
    // 显示当前页面的转发按钮
    // wx.showShareMenu({
    //   withShareTicket:true
    // })
    // 隐藏当前页面的转发按钮
    // wx.hideShareMenu()

    var scene = decodeURIComponent(options.scene)
    console.log('scene', scene);
    // 调用本地地址
    // wx.chooseAddress({
    //   success: function (res) {
    //     console.log('chooseAddress',res);

    //   }
    // })

  },
  // 选择上传图片
  chooseImage: function () {
    var that = this
    // 先判断
    wx.chooseImage({
      count: 3, // 一次可上传数 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log('res', res.tempFilePaths)
        that.setData({
          imageList: res.tempFilePaths
        })
        // console.log(1)
        // that.upload(that, res.tempFilePaths)
      },
    })
  },
  upload: function (page, path) {
    console.log(2)
    console.log('page', page, path)
    wx.showLoading({
      title: '正在上传',
      duration: 10000
    })
    page.setData({
      imageList: path[0]
    }, () => {
      console.log(this.data.imageList)
      wx.hideLoading()
    })

    // 将数据传给后台 然后在从后台获取数据
    // wx.uploadFile({
    //   url:'',
    //   filePath: path[0] ,
    //   name: 'file',
    //   success:res=>{
    //     if (res.resultCode == 200){
    //       page.setData({
    //         imageList: path[0]
    //       })
    //     }else{
    //       wx.showModal({
    //         title: '提示',
    //         content: '上传失败',
    //         showCancel: false
    //       })
    //       return;
    //     }
    //   }
    // })

  },
  // 图片预览
  previewImage: function (e) {
    console.log('e', e)
    var current = e.target.dataset.src
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imageList // 需要预览的图片http链接列表
    })
  },
  // 删除图片
  deleteImage: function (e) {
    var imageList = this.data.imageList
    var current = e.target.dataset.index
    imageList.splice(current, 1)
    this.setData({
      imageList: imageList
    })
  },

  // 拨打电话
  handleCallPhone: function () {
    util.callPhone(this.data.phone)
  },
  // 扫码
  handleScanCode: function (params) {
    wx.scanCode({
      success: function (res) {
        console.log(res);

      }
    })
  },
  // 获取用户手机号 该接口针对非个人开发者，且完成了认证的小程序开放。
  getPhoneNumber: function (e) {
    console.log(e);
    // 返回的数据result	所扫码的内容；scanType	所扫码的类型；charSet	所扫码的字符集；path 二维码携带的 path
    // 目前错误 { errMsg: "getPhoneNumber:fail 该 appid 没有权限" }
  },
  // copy
  handleCopy: function () {
    util.copyText('我是copy')
  },
  // 获取copy text
  getCopyText: function () {
    util.getCopyText()
  },
  // 添加手机联系人
  handleAddContack: function () {
    let data = {
      photoFilePath: '',
      firstName: '苗苗',
      lastName: '杨',
      mobilePhoneNumber: this.data.phone,
    }
    util.addPhoneContact(data)
  },
  // 显示model
  handleShowAction: function () {
    let _this = this
    let list = _this.data.actionList
    wx.showActionSheet({
      itemList: list,//按钮的文字数组，数组长度最大为6个
      success: function (res) {
        let tapIndex = res.tapIndex
        _this.setData({
          text: list[tapIndex]
        })
        // console.log(list[tapIndex]);
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    this.animation = animation
    // 旋转同时放大
    animation.scale(2, 2).rotate(45).step()
    this.setData({
      animationData: animation.export()
    })


    setTimeout(function () {
      animation.translate(30).step({ duration: 1000 })
      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this), 1000);

  },
  handletouchmove: function () {
    console.log(11);

  },
  //获取屏幕滚动出去的高度
  queryMultipleNodes: function () {
    var query = wx.createSelectorQuery()
    query.select('#the-id').boundingClientRect().selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res);

      let top = res[0].top       // 节点的上边界坐标
      console.log(top);

      //   //如果顶部的距离超过200   就显示GoTop按钮
      //   if (res[0].top < -300) {
      //     self.setData({
      //       showGoTop: true
      //     })
      //   }
      //   else {
      //     self.setData({
      //       showGoTop: false
      //     })
      //   }
    })
  },
  upper: function (e) {
    // console.log(e, 'e2')
    // console.log(2);
  },
  lower: function (e) {
    // console.log(e, 'e3')
    console.log(3);
  },
  scroll: function (e) {
    let _this = this
    // console.log(1);
    if (e.detail.scrollTop > (_this.data.screenHeight / 2)) {
      _this.setData({
        showGoTop: true
      })
    } else {
      _this.setData({
        showGoTop: false
      })
    }
  },
  goTop: function (e) {
    let _this = this
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 400
    })
    _this.setData({
      scrollTop: 0,
      showGoTop: false
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return util.openShare('分享title',
      '/pages/home/home?type==1',
      'http://ojny0bsco.bkt.clouddn.com/wp-content/uploads/2018/05/72014615_01.jpg',
      res => {
        "use strict";
        console.log(res)
        wx.getShareInfo({
          shareTicket: true,
          success: function (res) {
            console.log(res, 'getShareInfo')
          }
        })
      })
  },
  // 小程序开发-WXML节点信息
  getViewPosition: function (viewId) {
    //遍历获取
    var query = wx.createSelectorQuery()
    /** 
     * 第一种写法：默认返回匹配到的第一个节点信息 返回数据 [{},{}]
    */
    // query.select(viewId).boundingClientRect().selectViewport().scrollOffset()
    // query.exec(function(res) {
    //   console.log(res,'res'); //res就是 该元素的信息 数组
    //   console.log(res[0].left);
    // })

    /** 
     * 第二种写法：返回的是res数组，可获取多个同id对象的节点信息。返回具体的对象{}
    */
    query.select(viewId).boundingClientRect(res => {
      // console.log(res, 'res');
      // console.log(res.left);
    }).exec()
  },
  switchTab: function (e) {
    console.log(e);
    let _this = this
    _this.setData({
      currentTabIndex: e.currentTarget.dataset.index
    })
  },
  // 微信支付
  paySubmitBox: function (e) {
    console.log(e, 2);

    // wx.reLaunch({
    //   url:'/pages/order/order?IndexValue=1'
    // })
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
        console.log(res);

      },
      'fail': function (res) {
      }
    })
  },
  /** 
   * 打开App
  */

  launchAppError: function (e) {
    console.log(e.detail.errMsg)
  }
})