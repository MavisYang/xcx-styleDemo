// pages/user/refund/refund.js
const Refund = require('../../utils/refund');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listArr: null,//列表数据
        userMessage: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userMessage: wx.getStorageSync('userinfo')
        })
    },
    refundDetail: function (e) {
        wx.navigateTo({
            url: '/pages/refund/refundDetail/refundDetail?nums=' + e.target.dataset.nums
        })
    },
    skipIptNum: function (e) {
        wx.navigateTo({
            url: '/pages/refund/iptNum/iptNum?num=' + e.target.dataset.num
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
        Refund.refundList(res => {
            console.log(res)
            this.setData({
                listArr: res
            })
        })
    },
})