// pages/find/sucessPay/sucessPay.js
const util = require('../../utils/util.js')
const API = require('../../utils/api.js')
const app = getApp()
Page({
    data: {
        payStatus: null
    },
    onLoad: function (options) {
        console.log(options);
        this.setData({
            payStatus: options.status
        })
    },
})