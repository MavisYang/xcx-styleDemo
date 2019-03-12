let AuthProvider = require('./AuthProvider')
let wxRequest = require('./wxRequest')
/** 
 * 获取微信支付参数
 * @param {*} data 订单微信支付 传给后台的数据
 * @param {*} callback 返回数据
*/
function WChactPay(data, callback) {
      AuthProvider.getAccessToken().then(token => {
            return wxRequest.fetch(url, { type: 'bearer', value: token }, data, 'POST')
      }).then(res => {
            if (res.resultCode == 100) {
                  callback(res.resultContent)
            }
      }).catch(req => {
            console.log({ "err": 'Error this fetch' + req })
      })
}
/** 
 * 微信支付请求
 * @param {*} data 支付所需的参数
*/
function requestPayment(data, batchId) {
      wx.requestPayment({
            'timeStamp': data.timeStamp,  //时间戳
            'nonceStr': data.nonceStr,    //随机字符串，长度为32个字符以下
            'package': data.package,      //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
            'signType': 'MD5',            //签名算法，暂支持 MD5
            'paySign': data.paySign,      //签名
            'success': function (res) {
            },
            'fail': function (res) {
            }
      })

}

module.exports={
      WChactPay: WChactPay,
      requestPayment: requestPayment
}