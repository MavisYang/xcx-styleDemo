// pages/order/index.js
let app = getApp()
let util = require("../../utils/util.js")
let API = require('../../utils/api.js')
let wxRequest = require('../../utils/wxRequest.js')
let AuthProvider = require('../../utils/AuthProvider.js')
let wxApi = require('../../utils/api.js')
let Pay = require('../../utils/pay.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IndexValue: 0,
    dataArr: [],
    userMessage: {},
    dataState: false,
    currentPage: 10,//当前页码条数
    oldLength: 0,//数据长度
    popErrorMsg: '',//提示信息
    orderid: '',//临时存储orderno
    purid: '',//临时存储purid
    stop: true,//阻止机制
      refundArr1:["退款退货","补发"],
      refundArr2:["退款"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      userMessage: wx.getStorageSync('userinfo')
    })
    if (options.invalue) {
      _this.setData({
        IndexValue: options.invalue
      });
      if (_this.data.stop) {
        _this.setData({
          stop: false
        });
        getOrderList(_this.data.currentPage, options.invalue, (res) => {
          _this.setData({
            dataArr: res,
            oldLength: res.length,
            stop: true
          })
        })
      }
    }
  },
  // 切换列表显示数据的状态
  changeIndexValue: function (e) {
    console.log(e,'e---');
    
    let _this = this;
    if (_this.data.stop) {
      var IndexValue1 = e.target.dataset.index
      _this.setData({
        IndexValue: IndexValue1,
        stop: false
      }, () => {
        getOrderList(_this, 10, IndexValue1, (res) => {
          _this.setData({
            dataArr: res,
            stop: true
          });
        })
      })
    }
  },
  // 查物流
  goLogistics: function (e) {
    console.log(e.currentTarget.dataset)
    var orderId = e.currentTarget.dataset.orderid;
    var orderNo = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: `/pages/logistics/logistics?orderId=${orderId}&orderNo=${orderNo}`
    })
  },
  // 订单详情
  goOrderDetail: function (e) {
    var orderNo = e.currentTarget.dataset.orderid;
    var purchaseInsId = e.currentTarget.dataset.purchaseinsid;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?orderNo=${orderNo}&purchaseInsId=${purchaseInsId}`
    })
  },
  // 加载更多
  loadMoreList: function () {
    let _this = this;
    if (_this.data.stop) {
      _this.setData({
        currentPage: _this.data.currentPage + 10,
        stop: false
      }, () => {
        let url;
        if (parseInt(_this.data.IndexValue)) {
          url = `${API.getOrderList}${_this.data.currentPage}&status=${_this.data.IndexValue}`;
        } else {
          url = `${API.getOrderList}${_this.data.currentPage}`;
        }
        AuthProvider.getAccessToken().then(token => {
          return wxRequest.fetch(url, { type: 'bearer', value: token }, null, "GET")
        }).then(res => {
          if (res.data.resultCode == 100) {
            _this.setData({
              dataArr: res.data.resultContent,
              stop: true
            })
            if (_this.data.oldLength < res.data.resultContent.length) {
              _this.setData({
                oldLength: res.data.resultContent.length,
                stop: true
              })
              console.log(res.data.resultContent.length)
            } else {
              ErrorTips(_this, '没有更多了！');
              _this.setData({
                currentPage: _this.data.currentPage - 10,
                stop: true
              })
            }
          } else {
            _this.setData({
              currentPage: _this.data.currentPage - 10,
              stop: true
            })
          }
        })
      })
    }
  },
  //取消订单
  cancelOrder: function (e) {
    let _this = this;
    console.log(e)
    wx.showModal({
      title: '取消订单',
      content: '确定要取消订单吗？',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          console.log("true");
          let objData = {
            "cancleReason": null,
            "orderId": e.currentTarget.dataset.orderid,
          }
          console.log(objData)
          Pay.cancleOrder(objData, res => {
            console.log(res);
            getOrderList(_this, _this.data.currentPage, _this.data.IndexValue, (res) => {
              _this.setData({
                dataArr: res,
                oldLength: res.length
              })
            })
          })
        }
        if (res.cancel) {
          console.log("false")
        }
      },
      fail: function (req) {
        console.log(req)
      }
    })
  },
  // 确认收货
  affirmOrder: function (e) {
    let data = {
      orderId: e.currentTarget.dataset.orderid,
      purchaseInsId: e.currentTarget.dataset.purid
    }
    let _this = this;
    if (_this.data.stop) {
      _this.setData({
        stop: false
      })
      Pay.affirmOrder(data, res => {
        console.log('确认收货')
        getOrderList(_this, _this.data.currentPage, _this.data.IndexValue, (res) => {
          _this.setData({
            dataArr: res,
            oldLength: res.length,
            stop: true
          })
        })
      })
    }
  },
  // 申请售后
  applyOrder: function (e) {
    console.log(e.currentTarget.dataset)
    let purid = e.currentTarget.dataset.purid;
    let orderid = e.currentTarget.dataset.orderid;
    let orderstatus = e.currentTarget.dataset.orderstatus;
    this.setData({
      purid: purid,
      orderid: orderid
    })
  },
  //售后详情
  refundDeatil: function (e) {
    wx.navigateTo({
      url: '/pages/refund/refundDetail/refundDetail?nums=' + e.currentTarget.dataset.ticketid
    })
  },
  // 填写售后信息
  gotoRefund: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/refund/iptMessage/iptMessage?refundStutas=' + e.detail.value + '&purid=' + this.data.purid + '&orderid=' + this.data.orderid
    })
  },
  //支付订单
  payOrder: function (e) {
    let orderId = e.currentTarget.dataset.orderid;
    let money = e.currentTarget.dataset.money
    let _this = this;
    if (_this.data.stop) {
      _this.setData({
        stop: false
      })
      Pay.payOrder([orderId], res => {
        console.log('拿到支付数据' + res.id)
        let wxPayData = {
          "openId": wx.getStorageSync('openid'),
          "appid": API.APP_ID,
          "batchId": res.id,
          "billDetails": [{
            "amount": money,
            "paymentType": "3",
            "relatedItemId": null,//代金券或优惠券ID；暂无
            "seqNo": null//代金券或优惠券的顺序；暂无
          }],
          "payType": "3",
          "tradeType": "JSAPI"
        }
        Pay.WChactPay(wxPayData, result => {
          console.log(result);
          console.log("支付=>");
          Pay.requestPayment(result, wxPayData.batchId);
        })
        _this.setData({
          stop: true
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 每次进来加载当前数据的前10条数据
    getOrderList(this, 10, this.data.IndexValue, (res) => {
      this.setData({
        dataArr: res,
      });
    })
  },
})
// 获取订单列表数据
function getOrderList(that, currentPage, status, callback) {
  let url;
  if (parseInt(status)) {
    url = `${API.getOrderList}${currentPage}&status=${status}`;
  } else {
    url = `${API.getOrderList}${currentPage}`
  }
  AuthProvider.getAccessToken().then(token => {
    return wxRequest.fetch(url, { type: 'bearer', value: token }, null, "GET")
  }).then(res => {
    that.setData({
      stop: true
    })
    if (res.data.resultCode == 100) {
      callback(res.data.resultContent)
    }
  }).catch(req => {
    that.setData({
      stop: true
    })
  })
}

// 错误提示
function ErrorTips(that, str) {
  that.setData({
    popErrorMsg: str
  })
  hideErrorTips(that);
}

function hideErrorTips(that) {
  var fadeOutTimeout = setTimeout(() => {
    that.setData({
      popErrorMsg: '',
    });
    clearTimeout(fadeOutTimeout);
  }, 2000);
}