const API = require('./api.js')
let wxRequest = require('./wxRequest.js')
let AuthProvider = require('./AuthProvider.js')

/**
 * 提交确认订单 post
 * @param {*} data 提交确认订单数据，
 * @param {*} callback 返回参数
 */
function confirmOrder(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(API.confirmOrder, {type: 'bearer', value: token}, data, "POST")
    }).then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({"err": 'Error this fetch' + req})
    })
}

/**
 * post
 * @param {*} data 提交购买订单数据
 * @param {*} callback 返回参数
 */
function buyOrder(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(API.buyOrder, {type: 'bearer', value: token}, data, "POST")
    }).then(res => {
        callback(res.data)
    }).catch(req => {
        console.log({"err": 'Error this fetch' + req})
    })
}

/**
 * get
 * @param {*} data 确认收货数据  orderId
 * @param {*} callback 返回参数
 */
function affirmOrder(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(API.affirmOrder + data.orderId + '&purchaseInsId=' + data.purchaseInsId, {
            type: 'bearer',
            value: token
        }, null, "GET")
    }).then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({"err": 'Error this fetch' + req})
    })
}

/**
 * post
 * @param {*} data 取消订单数据
 * @param {*} callback  返回参数
 */
function cancleOrder(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(API.cancelOrder, {type: 'bearer', value: token}, data, "POST")
    }).then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({"err": 'Error this fetch' + req})
    })
}

/**
 * post
 * @param {*} data 新增留言数据
 * @param {*} callback  返回参数
 */
function leaveMessage(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(API.leaveMessage, {type: 'bearer', value: token}, data, "POST")
    }).then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({"err": 'Error this fetch' + req})
    })
}

/**
 * post
 * @param {*} data 订单微信支付
 * @param {*} callback 返回数据
 */
function WChactPay(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(API.WChactPay, {type: 'bearer', value: token}, data, "POST")
    }).then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({"err": 'Error this fetch' + req})
    })
}

/**
 *
 * @param {*} data 订单支付，id数组【id】
 * @param {*} callback
 */
function payOrder(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(API.payOrder, {type: 'bearer', value: token}, data, "POST")
    }).then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({"err": 'Error this fetch' + req})
    })
}


function requestPayment(data, batchId) {
    wx.requestPayment({
        'timeStamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': 'MD5',
        'paySign': data.sign,
        'success': function (res) {
            wx.reLaunch({url: '/pages/order/index?invalue=2'})
        },
        'fail': function (res) {
            wx.reLaunch({url: '/pages/order/index?invalue=1'})
        }
    })
}

module.exports = {
    confirmOrder: confirmOrder,//提交确认订单
    buyOrder: buyOrder,//提交购买订单
    payOrder: payOrder,//订单支付
    affirmOrder: affirmOrder,//确认收货
    cancleOrder: cancleOrder,//取消订单
    leaveMessage: leaveMessage,//买家留言
    WChactPay: WChactPay,//获取微信支付参数
    requestPayment: requestPayment,//微信支付
}