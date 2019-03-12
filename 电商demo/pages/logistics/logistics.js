// pages/user/logistics/logistics.js
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
        scrollYState: true,
        logisticsD: '',
        logisticsM: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        console.log(options.orderId, '物流订单号');
        AuthProvider.getAccessToken().then(token => {
            return wxRequest.fetch(API.getLogisticsD + options.orderId, { type: 'bearer', value: token }, null, "GET");
        }).then(result => {
            if (result.data.resultCode == 100) {
                result.data.resultContent.orderNo = options.orderNo;
                _this.setData({
                    logisticsD: result.data.resultContent
                })
            } else {
                console.log('请求失败')
            }
        })

        wxRequest.fetch(API.getLogisticsM + options.orderId + '/express/details', null, null, "GET").then(res => {
            console.log(res)
            if (res.data.resultCode == 100) {
                _this.setData({
                    logisticsM: res.data.resultContent
                })
            }
        })
    },
    lookImg: function () {
        console.log('预览图片')
        this.setData({
            scrollYState: false,
        })
    },
    closePreview: function () {
        console.log('关闭预览图片')
        this.setData({
            scrollYState: true
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

    }
})