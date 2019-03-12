var AuthProvider = require('../../utils/AuthProvider.js')
var component = require('../../utils/component.js')
var util = require('../../utils/util.js')
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    centerList:[
      {
        iconPath:'/images/icon_list_order.png',
        label:'查看全部订单',
        arrowPath: '/images/ic_list_arrow@2x.png',
        index:0
      },
      {
        iconPath: '/images/icon_list_address.png',
        label: '我的收件地址',
        arrowPath: '/images/ic_list_arrow@2x.png',
        index: 1        
      },
      {
        iconPath: '/images/icon_list_refund.png',
        label: '退换与售后',
        arrowPath: '/images/ic_list_arrow@2x.png',
        index: 2        
      },
      {
        iconPath: '/images/icon_list_customer.png',
        label: '联系客服',
        arrowPath: '/images/ic_list_arrow@2x.png',
        index: 3
      }
    ]
  },
  //事件处理函数
  bindViewTap: function(e) {
    var index = e.target.dataset.index
    if (index!=undefined){
      console.log(index)
      switch(index){
        case 0:
          component.switchTab('../order/order');
          break;
        case 1:
          component.navigateTo('../index/index');
          break;
        case 2:
          component.navigateTo('../logs/logs');
          break;
        case 3:
          component.switchTab('../home/home');
          break;
        default:
          break;
      }
      
    }
  },
  onLoad: function () {
    let _this = this;
    app.getGlobalDatas(this.data.canIUse,res=>{
      this.setData({
        hasUserInfo: res.hasUserInfo,
        userInfo: res.userInfo
      })
    })
  },
  
 
  getUserInfo: function (e) {
    app.getUserInfoAll(e, res => {
      "use strict";
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: res.hasUserInfo
      });
    })
  },
})


