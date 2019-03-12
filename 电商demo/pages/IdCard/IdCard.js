// pages/IdCard/IdCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IdCardOne: '',
    IdCardTwo: '',
    IdName: '',
    IdNo: '',
    popErrorMsg: '',//错误提示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  choseIdCardOne: function (e) {
    var _this = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        _this.setData({
          IdCardOne: res.tempFilePaths[0]
        })
      }
    })
  },
  choseIdCardTwo: function (e) {
    var _this = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        _this.setData({
          IdCardTwo: res.tempFilePaths[0]
        })
      }
    })
  },
  changeIdName: function (e) {
    // console.log(e.detail.value)
    this.setData({
      IdName: e.detail.value
    })
  },
  changeIdNo: function (e) {
    // console.log(e.detail.value)
    this.setData({
      IdNo: e.detail.value
    })
  },
  submitIdCard: function (e) {
    var { IdNo, IdName, IdCardOne, IdCardTwo } = this.data;
    console.log(IdName, IdNo)
    if (!IdNo || !IdName) {
      ErrorTips(this, '请完善所需参数')
    } else {
      console.log('提交成功');
      wx.setStorageSync('IdName', IdName)
      wx.setStorageSync('IdNo', IdNo)
      wx.navigateBack({
        delta: 1
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('IdNo')) {
      this.setData({
        IdNo: wx.getStorageSync('IdNo'),
      })
    }
    if (wx.getStorageSync('IdName')) {
      this.setData({
        IdName: wx.getStorageSync('IdName'),
      })
    }
  },
})
// 错误提示
function ErrorTips(that, str) {
  that.setData({
    popErrorMsg: str
  })
  hideErrorTips(that);
}

function hideErrorTips(that) {
  var fadeOutTimeout = setTimeout(() => {
    that.setData({
      popErrorMsg: '',
    });
    clearTimeout(fadeOutTimeout);
  }, 2000);
}