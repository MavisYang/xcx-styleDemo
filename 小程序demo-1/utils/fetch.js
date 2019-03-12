let wxUploadFile = require('./uploadFile');
let AuthProvider = require('./AuthProvider');
let wxRequest = require('./wxRequest');
let API = require('./api');
/**
 * 上传图片得到url地址
 * @param imgUrl
 * @param callback
 */
function downloadImg(imgUrl, callback) {
  AuthProvider.getAccessToken().then(token => {
    return wxUploadFile.uploadFile(API.uploadImg, imgUrl, token);
  }).then(result => {
    let resData = JSON.parse(result.data);
    callback(resData.resultContent);
  })
}
module.exports={
  downloadImg: downloadImg
}