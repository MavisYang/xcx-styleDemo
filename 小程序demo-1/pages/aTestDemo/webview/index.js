// pages/aTestDemo/webview/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    h5Url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // h5：https://wx.gemii.cc/gemii/poster/index.html；是已经有发布在服务器中的
    let urls = 'https://wx.gemii.cc/gemii/poster/index.html?id=' + options.scene + '&urlType=pro&updateState=' + options.updateState;
    if (options.scene) {
      this.setData({
        url: urls
      })
    }
    // 在h5中wx.miniProgram.redirectTo跳转回小程序
    //wx.miniProgram.redirectTo({
    // url: `/pages/sell/poster/index?dataUrl=${res2.resultContent}&scene=${parmas.id}&updateState=${parmas.updateState}`
    // })
    // 在poster / index中获取options.dataUrl
    // this.setData({
    //   updateState: options.updateState || null,
    //   imgUrl: options.dataUrl,
    //   scene: options.scene
    // });
      
  
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
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})