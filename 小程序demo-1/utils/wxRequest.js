var Promise = require('./es6-promise');
/**
 *
 * */
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        // console.log('→返回数据：'+ res.data)
        // console.log('→end')
        wx.hideToast()
        resolve(res);
      }
      obj.fail = function (res) {
        //失败
        // console.log('→请求失败：' + JSON.stringify(res))
        // console.log('→end')
        wx.hideToast()
        reject(res)
      }
      fn(obj)
    })
  }
}
/**
 * 无论promise对象最后状态如何都会执行
 */
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

/**
 * 微信请求，以是否有token传入判断是否走鉴权 封装请求数据
 */
var wxRequest = function(url,token,data,type){
  var datas = JSON.stringify(data)
  wx.showModal({
    title: '加载中',
    icon:'loading',
    dutation:10000
  })
  var wxtRequest = wxPromisify(wx.request); //通过wx.request请求获取code值
  var header = {'Content-Type': 'application/json;charset=UTF-8'};
  if(token){
    header={
      'Content-Type': 'application/json;charset=UTF-8',
      "Authorization": token.type + ' ' + token.value //base64加密liz-youli-wx:secret
    }
  }
  return wxtRequest({
    url:url,
    method:type,
    data:datas,
    dataType:'json',
    header:header
  })
}

module.exports = {
  fetch: wxRequest
}