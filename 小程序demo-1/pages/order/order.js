let util = require('../../utils/util')
let API = require('../../utils/api.js')
//order.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IndexValue: 0,
    orderTitle: [
      { index: 0, label: '全部' },
      { index: 1, label: '待支付' },
      { index: 2, label: '待发货' },
      { index: 3, label: '已发货' },
      { index: 4, label: '已完成' }
    ],
    orderList: [],
    stop: true,//阻止机制
    currentPage: 10,//当前页码条数
    oldLength: 0,//数据长度
    isMore: true,//是否有更多的数据
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    console.log(options, 'options')
    // this.orderList()
    if (options.IndexValue){
      self.setData({
        IndexValue: options.IndexValue
      })
    }
    this.orderList()
  },

  handleChangeTab: function (e) {
    console.log(e)
    let self = this;
    self.setData({
      IndexValue: e.target.dataset.index
    }, () => {
      this.orderList()
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

  },

  orderList: function (e) {
    let self = this;
    let indexStatus = self.data.IndexValue
    let list = API.list
    let newList = []
    util.handleLoading(newList)
    if (indexStatus == 0) {
      newList = list
    } else {
      list.forEach(item => {
        if (indexStatus == item.status) {
          newList.push(item)
        }
      })
    }
    self.setData({
      oldLength: newList.length,
      orderList: newList
    })
  },
  
  // 加载更多
  loadMoreList: function (e) {
    // console.log(111, e);
    let _this = this
    if (_this.data.stop) { //可进行请求数据
      _this.setData({
        currentPage:_this.data.currentPage+10,
        stop:false,
        isMore: false
      },()=>{
        // 获取列表数据
        // this.getOrderList()
        // 成功之后返回数据判断

        // let list = API.list
        // if (list){
        //   let orderList = _this.data.orderList
        //   orderList.push(list[2])
        //   orderList.push(list[3])
        //   _this.setData({
        //     orderList: orderList,
        //     stop: true
        //   })
        //   console.log(_this.data.orderList,'1');
        //   console.log(_this.data.oldLength, 'oldLength');
        //   console.log(list.length, 'list.length');
        //   if (_this.data.oldLength < list.length) {
        //     console.log(1111);
        //     _this.setData({
        //       oldLength: _this.data.oldLength,
        //       stop: true
        //     })
        //   } else {
        //     console.log('no more');
        //     // 没有更多了
        //     _this.setData({
        //       isMore: false,
        //       currentPage: _this.data.currentPage - 10
        //     })
        //   }
        // }else{
        //   _this.setData({
        //     stop: true,
        //     currentPage: _this.data.currentPage - 10
        //   })
        // }
      })
    }
  },
  getOrderList(){
    let _this= this
    let url=`${API.getOrderList}${_this.data.currentPage}&status=${_this.data.IndexValue}`;
    AuthProvider.getAccessToken().then(token => {
      return wxRequest.fetch(url, { type: 'bearer', value: token }, null, "GET")
    }).then(res => {
      if (res.data.resultCode == 100) {
        _this.setData({
          dataArr: res.data.resultContent,
          stop: true
        })
        if (_this.data.oldLength < res.data.resultContent.length) {
          _this.setData({
            oldLength: res.data.resultContent.length,
            stop: true
          })
          console.log(res.data.resultContent.length)
        } else {
          ErrorTips(_this, '没有更多了！');
          _this.setData({
            currentPage: _this.data.currentPage - 10,
            stop: true
          })
        }
      } else {
        _this.setData({
          currentPage: _this.data.currentPage - 10,
          stop: true
        })
      }
    })
  }


})


