// pages/user/refund/refundDetail/refundDetail.js
const app = getApp()
const util = require('../../../utils/util.js')
const API = require('../../../utils/api.js')
let AuthProvider = require('../../../utils/AuthProvider.js')
let wxUploadFile = require('../../../utils/uploadFile.js')
let wxRequest = require('../../../utils/wxRequest.js')
let Refund = require('../../../utils/refund.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnState: false,
    createData: [],//taskList数据
    dtData: null,//申请数据
    refundDetails: null,//详情数据
    goodsDetail: null,//商品详情
    cancleStatus: null,//可取消
    expressInfo: null,
    mainData: null,
    stop: true,//阻止机制
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.nums)
    Refund.refundDetail(options.nums, res => {
      console.log(res)
      let data = {
        refundOrderNo: res.applyDetail.refundOrderNo,
        refundType: res.refundType,
        orgRefundAmount: res.applyDetail.orgRefundAmount,
        refundReasonDesc: res.applyDetail.refundReasonDesc,
        createDate: res.applyDetail.createDate
      }
      console.log(data)
      this.setData({
        goodsDetail: res.applyDetail.refundOrderItem[0],
        refundDetails: res.applyDetail,
        dtData: data,
        cancleStatus: res.taskDefinitionKey,
        expressInfo: res.expressInfo,
        mainData: res
      });
      Refund.createData(res.taskList, res, result => {
        console.log(result)
        this.setData({
          createData: result
        })
      })
    })
  },
  cancelRefund: function (e) {
    console.log(e)
    wx.showModal({
      title: '取消退款',
      content: '取消退款后不能再次申请退款',
      confirmColor: '#F45C43',
      mask: true,
      success: function (res) {
        if (res.confirm) {
          let data = {
            processInsId: e.currentTarget.dataset.processinsid,
            taskId: e.currentTarget.dataset.taskid,
            body: {
              "userCancleFlg": "Y"
            }
          }
          Refund.refundCancle(data, res => {
            console.log(res)
            wx.navigateBack({
              delta: 1
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  skipIptNum: function (e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: `/pages/refund/iptNum/iptNum?orderId=${e.currentTarget.dataset.orderid}&processInsId=${e.currentTarget.dataset.pid}&taskId=${e.currentTarget.dataset.taskid}`
    })
  },
  singUp: function (e) {
    console.log(e.currentTarget.dataset.pid, 1)
    console.log(e.currentTarget.dataset.taskid, 2)
    if (this.data.stop) {
      this.setData({
        stop: false
      })
      AuthProvider.getAccessToken().then(token => {
        let url = `${API.affirmRefundOrder}?processInsId=${e.currentTarget.dataset.pid}&taskId=${e.currentTarget.dataset.taskid}&isNeedReceive=${true}`;
        return wxRequest.fetch(url, { type: 'bearer', value: token }, {}, "POST");
      }).then(res => {
        this.setData({
          stop: true
        })
        if (res.data.resultCode == 100) {
          console.log(res)
          wx.navigateBack({
            delta: 1
          })
        } else {
          console.log("error")
        }
      }).catch(req => {
        console.log({ "err": 'Error this fetch' + req })
      })
    }


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})