let wxUploadFile = require('./uploadFile');
let AuthProvider = require('./AuthProvider');
let wxRequest = require('./wxRequest');
let API = require('./api');

/**
 * 时间格式化
 */
const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatZero).join('/') + ' ' + [hour, minute].map(formatZero).join(':')
}
/**
 * 补零
 */
const formatZero = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 剩余时间
 * 1天==24小时=24*60分钟==24*60*60秒==24*60*60*1000毫秒
 * 1小时==60分==60*60秒==60*60*1000毫秒
 * 结束时间-当前时间//好秒数
 * (结束时间-当前时间)/1000 //秒杀
 * @param time 时间差 Math.floor((结束时间-当前时间)/1000)
 */
function timeLeft(time) {
  var leave1 = time % (24 * 3600)
  //计算相差小时数
  var hours = Math.floor(leave1 / 3600)
  //计算相差分钟数
  var leave2 = leave1 % 3600       //计算小时数后剩余的秒数
  var minutes = Math.floor(leave2 / 60)
  //计算相差秒数
  var leave3 = leave2 % 60
  var seconds = leave3
  return formatZero(hours) + ":" + formatZero(minutes) + ":" + formatZero(seconds)
}
/**
 *
 *
 * @param {*} params
 */
function getDate(that) {
  // 时间
  let date = new Date();
  let beforeYear = 1990;
  let afterYear = date.getFullYear() + 32;//2018+32=2050
  let years = [], months = [], days = [], hours = [], minutes = [];

  for (let i = beforeYear; i <= afterYear; i++) {
    years.push(i)
  }

  for (let i = 1; i <= 12; i++) {
    months.push(i)
  }

  for (let i = 1; i <= 31; i++) {
    days.push(i)
  }
  for (let i = 0; i < 24; i++) {
    hours.push(formatZero(i))
  }
  for (let i = 0; i < 60; i++) {
    minutes.push(formatZero(i))
  }

  let valueInit=[];
  years.forEach((item,i) => {
    if (date.getFullYear()==item)
      valueInit.push(i)
  });
  months.forEach((item, i) => {
    if (date.getMonth() + 1 == item)
      valueInit.push(i)
  });
  days.forEach((item, i) => {
    if (date.getDate() == item) 
      valueInit.push(i)
  });
  hours.forEach((item, i) => {
    if (date.getHours() == item)
      valueInit.push(i)
  });
  minutes.forEach((item, i) => {
    if (date.getMinutes() == item)
      valueInit.push(i)
  })
  console.log(valueInit,'valueInit');
  

  that.setData({
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    valueInit: valueInit//选择后value数组
  })
}


/**
 * 设置时间范围 
 * @param start 
 * @param end 
 * 天数
 */
function rangeDate(start,end){
  let nowTime = new Date().getTime();
  var before = 1000 * 60 * 60 * 24 * start;//当前日期之前的日期，（小于）
  var after = 1000 * 60 * 60 * 24 * end;//当前日期之后的日期（大于）
  var beforeTime = new Date(nowTime - before);//"2016-01-01" 前：185天
  var afterTime = new Date(nowTime + after);//"2018-15-5" 后 280天
  var minYear = beforeTime.getFullYear();
  var minMonth = ("0" + (beforeTime.getMonth() + 1)).slice(-2);
  var minDay = ("0" + beforeTime.getDate()).slice(-2);
  var maxYear = afterTime.getFullYear();
  var maxMonth = ("0" + (afterTime.getMonth() + 1)).slice(-2);
  var maxDay = ("0" + afterTime.getDate()).slice(-2);
  var maxDate = maxYear + "-" + maxMonth + "-" + maxDay; //max="2018-03-02" endTime
  var minDate = minYear + "-" + minMonth + "-" + minDay; //min="2016-06-01" beginTime
  return [minDate,maxDate]

}
/**
 * 倒计时
 * @param that
 * @param total_micro_second
 */
var count_down = function (that, total_micro_second) {
  if (total_micro_second <= 0) {
    that.setData({
      phoneText: '重新获取',
      phoneCodeState: true
    });
    // timeout则跳出递归
    return;
  }
  // 渲染倒计时时钟
  that.setData({
    phoneText: formatZero(date_format(total_micro_second)) + 's后重试',
    phoneCodeState: false
  });
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that, total_micro_second);
  }, 10)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
var date_format = function (micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = Math.floor((second - hr * 3600) / 60);
  // 秒位
  var sec = (second - hr * 3600 - min * 60); // equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = Math.floor((micro_second % 1000) / 10);
  return sec;
}
/** 
 * 获取系统信息 getSystemInfo
*/
function getSystemInfo() {
  let systemInfo;
  wx.getSystemInfo({
    success: function (res) {
      // console.log(res);
      systemInfo = res
    }
  })
  return systemInfo
}
// 页面跳转数据字典
// 1:navigate  保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面  可加参数
// 2:redirectTo 关闭当前页面，跳转到应用内的某个页面。 可加参数
// 3:reLaunch 关闭所有页面，打开到应用内的某个页面。 可加参数
// 4:switchTab 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面  不可加参数
// 5:navigateBack 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层
/**
 * 页面跳转函数
 * @param path 跳转路径 部分可携带参数
 * @param type 跳转类型
 * @param num 是否为返回上级
 */
function pageGo(path, type, num) {
  if (num) {
    wx.navigateBack({
      delta: path
    })
  } else {
    switch (type) {
      case 1:
        wx.navigateTo({
          url: path
        });
        break;
      case 2:
        wx.redirectTo({
          url: path
        });
        break;
      case 3:
        wx.reLaunch({
          url: path
        });
        break;
      case 4:
        wx.switchTab({
          url: path
        });
        break;
      default:
        break
    }
  }
}

// /**
//  * 分享集成函数
//  * @param title 分享的标题
//  * @param path 分享的页面路径
//  * @param imageUrl 分享出去要显示的图片
//  * @param callback 分享后的回调
//  * @returns {{title: *, path: *, imageUrl: *, success: success, complete: complete}}
//  */
function openShare(title, path, imageUrl,callback) {
  return {
    title: title,
    path: path,
    imageUrl: imageUrl,
    success: function(res) {
      wx.showToast({
        title:'分享成功',
        icon: 'success',
        duration: 3000
      })
    },
    complete: function(req) { //不管成功与否都会调用
      callback(req)
    }
  }
}
/**
 * 获取经纬度 打开地图
 */
 function loaction(params) {
   wx.getLocation({
     success: function (res) {
       console.log(res, 'res');
       var latitude = res.latitude;
       var longitude = res.longitude;
       wx.openLocation({
         latitude: latitude,
         longitude: longitude,
         scale: 28
       })
     }
   })
 }

 /**
 * 拨打电话 此处phoneNumber 要传的值要是字符串
 */
function callPhone(phoneNum) {
  wx.makePhoneCall({
    phoneNumber: phoneNum.toString()
  })
}
/**
 *  错误全局提示
 * @param that
 * @param str
 * @constructor
 * <view class="ad_popError" wx:if="{{popErrorMsg}}">{{popErrorMsg}}</view>
 */

function ErrorTips(that, str) {
  that.setData({
    stop: true,
    popErrorMsg: str
  });
  hideErrorTips(that);
}
function hideErrorTips(that) {
  let fadeOutTimeout = setTimeout(() => {
    that.setData({
      popErrorMsg:null
    })
    clearTimeout(fadeOutTimeout)
  }, 3000);
}
/**
 * 全局复制函数
 * @param str 需要复制的文字
 */
function copyText(str) {
  wx.setClipboardData({
    data: str,
    success: function(res) {
      wx.showToast({
        title: str,
        icon: 'success',
        duration: 2000
      })
    }
  })
}
function getCopyText() {
  wx.getClipboardData({
    success: function (res) {
      console.log(res,'copy res');
      console.log(res.data);
    }
  })
}
/**
 * loading
 */
function handleLoading(data) {
  if (!data.length) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 300
    })
  } else {
    wx.hideToast()
  }
}
/** 
 * 显示 success model
*/
function successModel(str) {
  wx.showToast({
    title: str,
    icon: 'success', //图标，有效值 "success", "loading", "none"
    duration: 2000,
    mask:true,
  })
}
/** 
 * 显示 fail model
*/
function failModel(str) {
  wx.showToast({
    title: str,
    image: '/images/cancelIcon2.png',
    duration: 2000,
    mask: true,
  })
}
/** 
 * 显示 show model
*/
function showModal(title, content,callback) {
  wx.showModal({
    title: title,
    content: content,
    success: function() {
      return callback
    }
  })
}
/** 
 * 新增联系人”或“添加到已有联系人”的方式
*/
function addPhoneContact(data) {
  wx.addPhoneContact({
    firstName: data.firstName,
    lastName: data.lastName,
    mobilePhoneNumber: data.mobilePhoneNumber,
    success: function (res) {
      console.log(res);
    },
    fail: function () {
      failModel('添加失败')
    }
  })
}
/** 
 * 设置导航条样式动画
*/
function setNavigation(bgColor) {
  // 动态设置当前页面的标题。
  // wx.setNavigationBarTitle({
  //   title: '当前页面'
  // })
  // 设置导航条样式动画
  wx.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#ff0000',
    animation: {
      duration: 400,
      timingFunc: 'easeIn'
    },
    success: function (res) {
      // console.log(res);
    },
    fail: function (res) {
      console.log(res);
    }
  })
}
/**
 * 上传图片得到url地址
 * @param imgUrl
 * @param callback
 */
function downloadImg(imgUrl, callback) {
  AuthProvider.getAccessToken().then(token => {
    console.log(token)
    return wxUploadFile.uploadFile(API.uploadImg, imgUrl, token);
  }).then(result => {
    let resData = JSON.parse(result.data);
    callback(resData.resultContent);
  })
}
module.exports = {
  formatTime: formatTime,
  formatZero: formatZero,
  count_down: count_down,//倒计时
  timeLeft: timeLeft,//计算剩余时间
  date_format: date_format,
  rangeDate: rangeDate,
  getDate: getDate,
  getSystemInfo: getSystemInfo,
  pageGo:pageGo,
  openShare: openShare,
  callPhone: callPhone,
  copyText: copyText,
  getCopyText: getCopyText,
  ErrorTips: ErrorTips,
  successModel: successModel,
  failModel: failModel,
  addPhoneContact: addPhoneContact,
  showModal: showModal,
  handleLoading: handleLoading,
  setNavigation: setNavigation,
  downloadImg: downloadImg
}
