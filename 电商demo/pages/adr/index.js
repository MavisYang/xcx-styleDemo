// pages/adr/index.js
const app = getApp()
const util = require('../../utils/util.js')
const API = require('../../utils/api.js')
let wxRequest = require('../../utils/wxRequest.js')
let AuthProvider = require('../../utils/AuthProvider.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adrEdit: true,//编辑地址
    adrList: [],//；地址列表
    userName: '',
    userPhoneNum: '',
    userAdr: ['广东省', '广州市', '海珠区'],
    adrDetail: '',//详细地址
    adrDefault: false,//是否设置为默认
    getAdr: false,//是否是在pay页面进来的
    goods: '',//返回携带参数,
    adrId: '',//地址id
    startX: 0,
    delBtnWidth: 60,
    stop: true,//阻止机制
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.goods) {
      this.setData({
        goods: options.goods
      })
    }
    if (options.getAdr) {
      this.setData({
        getAdr: true
      })
    } else {
      this.setData({
        getAdr: false
      })
    }
  },
  //选择省市区
  bindUserAdrChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      userAdr: e.detail.value
    })
  },
  //是否保存为默认
  switch2Change: function (e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      adrDefault: e.detail.value
    })
  },
  //提交地址
  submit: function (e) {
    console.log("保存地址")
    var obj = {
      "cityName": this.data.userAdr[1],
      "contactTel": this.data.userPhoneNum,
      "contactor": this.data.userName,
      "countyName": this.data.userAdr[2],
      "detailAddr": this.data.adrDetail,
      "postCode": '000000',
      "provinceName": this.data.userAdr[0],
      "type": 2,
      "primaryFlag": this.data.adrDefault
    }
    console.log(e.currentTarget.dataset.adrid)
    if (this.data.stop) {
      this.setData({
        stop: false
      });
      if (this.data.adrDetail && this.data.userName && this.data.userPhoneNum && this.data.userAdr.length) {
        if (e.currentTarget.dataset.adrid) {
          let url1 = API.deleteAdr + e.currentTarget.dataset.adrid + '/status?_status=3';
          AuthProvider.getAccessToken().then(token => {
            return wxRequest.fetch(url1, { type: 'bearer', value: token }, obj, 'DELETE')
          }).then(res => {
            console.log('删除成功')
          })
        }
        AuthProvider.getAccessToken().then(token => {
          return wxRequest.fetch(API.getAdrId, { type: 'bearer', value: token }, obj, 'POST')
        }).then(res => {
          this.setData({
            stop: true
          },()=>{
            "use strict";
              if (res.data.resultCode == 100) {
                  console.log(res)
                  getAdrList(app, this);
              }
          });
        })
      }
    }
  },
  // 删除地址
  delProduction: function (e) {
    let _this = this;
    if (_this.data.stop) {
      _this.setData({
        stop: false
      });
      let url1 = API.deleteAdr + e.currentTarget.dataset.adrid + '/status?_status=3';
      AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(url1, { type: 'bearer', value: token }, null, 'DELETE')
      }).then(res => {
        console.log('删除成功');
        _this.setData({
          stop: true
        },()=>{
          "use strict";
            getAdrList(app, _this);
        });
      })
    }
  },
  //输入姓名
  changeUserName: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  //输入手机号
  changeUserNum: function (e) {
    this.setData({
      userPhoneNum: e.detail.value
    })
  },
  //收入详细地址
  changeAdr: function (e) {
    this.setData({
      adrDetail: e.detail.value
    })
  },
  addAdItem: function () {
    this.setData({
      adrEdit: true
    })
  },
  goBack: function () {
    getAdrList(app, this);

  },

  operation: function (e) {
    console.log(this.data.getAdr);
    console.log(e.currentTarget.dataset.id);
    if (this.data.stop) {
      this.setData({
        stop: false
      });
      if (this.data.getAdr) {
        this.setData({
          stop: true
        })
        wx.redirectTo({
          url: `/pages/pay/pay?AdrId=${e.currentTarget.dataset.id}&goods=${this.data.goods}`
        })
      } else {
        let url1 = API.getAdrDetail + e.currentTarget.dataset.id + '/assemble';
        AuthProvider.getAccessToken().then(token => {
          return wxRequest.fetch(url1, { type: 'bearer', value: token }, null, "GET")
        }).then(res => {
          this.setData({
            stop: true
          })
          if (res.data.resultCode == 100) {
            this.setData({
              adrEdit: true,
              userName: res.data.resultContent.contactor,
              userPhoneNum: res.data.resultContent.contactTel,
              adrDetail: res.data.resultContent.detailAddr,
              adrDefault: res.data.resultContent.primaryFlag,
              adrId: res.data.resultContent.id,
              userAdr: [res.data.resultContent.provinceName, res.data.resultContent.cityName, res.data.resultContent.countyName],
            })
          }
        })
      }
    }
  },
  touchS: function (e) {
    var txtStyle = "left:0px";
    var list = this.data.adrList;
    for (var i = 0; i < list.length; i++) {
      list[i].txtStyle = txtStyle;
    }
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX,
        adrList: list
      });
      // console.log(e.touches[0].clientX)
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变  
        txtStyle = "left:0px";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var list = this.data.adrList;
      list[index].txtStyle = txtStyle;
      // 更新列表的状态  
      this.setData({
        adrList: list
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.currentTarget.dataset.index;
      var list = this.data.adrList;
      list[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        adrList: list
      });
    }
  },
  //获取元素自适应后的实际宽度  
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应  
      // console.log(scale);  
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error  
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getAdrList(app, this);
  },
})

function getAdrList(app, that) {
  //获取地址列表
  console.log('获取地址列表')
  if (that.data.stop) {
    that.setData({
      stop: false
    })
    AuthProvider.getAccessToken().then(token => {
      return wxRequest.fetch(API.getAdrList, { type: 'bearer', value: token }, { type: 2 }, 'POST')
    }).then(res => {
      if (res.data.resultCode == 100) {
        that.setData({
          adrList: res.data.resultContent,
          stop: true
        }, function () {
          console.log(that.data.adrList);
          if (that.data.adrList.length > 0) {
            that.setData({
              adrEdit: false
            })
          } else {
            that.setData({
              adrEdit: true
            })
          }
        })
      } else {
        that.setData({
          adrEdit: true,
          stop: true
        })
      }
    })
  }
}