// pages/user/orderDetail/orderDetail.jslet app = getApp()
let app = getApp()
let util = require("../../utils/util.js")
let wxRequest = require('../../utils/wxRequest.js')
let AuthProvider = require('../../utils/AuthProvider.js')
let API = require('../../utils/api.js')
let Pay = require('../../utils/pay.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {},//订单详情数据
    orderAdr: '',//收货地址
    stop: true,//阻止机制
      refundArr1:["退款退货","补发"],
      refundArr2:["退款"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let url = `${API.orderDetail}purchaseInsId=${options.purchaseInsId}&orderId=${options.orderNo}`
    AuthProvider.getAccessToken().then(token => {
      return wxRequest.fetch(url, { type: 'bearer', value: token }, {}, "GET")
    }).then(res => {
      console.log(res);
      if (res.data.resultCode == 100) {
        this.setData({
          orderDetail: res.data.resultContent
        });
        let url1 = API.getAdrDetail + res.data.resultContent.recieverInfo.deliverAddrId + '/assemble';
        AuthProvider.getAccessToken().then(token => {
          return wxRequest.fetch(url1, { type: 'bearer', value: token }, null, "GET")
        }).then(res => {
          if (res.data.resultCode == 100) {
            console.log(res.data)
            this.setData({
              orderAdr: res.data.resultContent
            })
          }
        })
      }
    }).catch(req => {
      console.log(req)
    })
  },
  //申请售后
  gotoRefund: function (e) {
    console.log("shenq售后")
    wx.navigateTo({
      url: '/pages/refund/iptMessage/iptMessage?refundStutas=' + e.detail.value + '&orderid=' + this.data.orderDetail.orderId + '&purid=' + this.data.orderDetail.purchaseInsId
    })
  },
  //查看物流
  skipLogistics: function () {
    wx.navigateTo({
      url: '/pages/logistics/logistics?orderId=' + this.data.orderDetail.orderId + '&orderNo=' + this.data.orderDetail.orderNo
    })
  },
  //售后详情
  refundDeatil: function (e) {
    wx.navigateTo({
      url: '/pages/refund/refundDetail/refundDetail?nums=' + e.currentTarget.dataset.ticketid
    })
  },
  //确认收货
  confirmOrder: function () {
    let data = {
      orderId: this.data.orderDetail.orderId,
      purchaseInsId: this.data.orderDetail.purchaseInsId
    }
    if (this.data.stop) {
      this.setData({
        stop: false
      });
      Pay.affirmOrder(data, res => {
        console.log(res);
        this.setData({
          stop: true
        });
        wx.navigateBack({
          delta: 1
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
        if (res.confirm) {
          console.log("true");
          let objData = {
            "cancleReason": null,
            "orderId": _this.data.orderDetail.orderId,
          }
          Pay.cancleOrder(objData, res => {
            console.log(res);
            wx.navigateBack({
              delta: 1
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
  //支付订单
  payOrder: function (e) {
    let orderId = this.data.orderDetail.orderId;
    let money = this.data.orderDetail.billInfo.realChargePrice;
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
          _this.setData({
            stop: true
          })
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})