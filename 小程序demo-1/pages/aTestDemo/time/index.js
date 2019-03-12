//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js');
var dateTimePicker = require('../../../utils/dateTimePicker.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    arrayIndex:null,
    time:'12:01',
    date:[],
    startDate:'',
    endDate:'',
    expiredDate: new Date('2018/6/29 23:59:59').getTime(),//秒杀过期时间
    timeLeftBargain: '00:00:00',//秒杀剩余时间
    maskVisual: 'hidden',
    animationData: '',
    modelHeight:'100%',
    animationTime:'',
    years: null,
    months: null,
    days: null,
    hours:null,
    minutes:null,
    year:2018,
    month:6,
    day:29,
    valueInit: null,//选择后value数组
    dateValue:null,//选定的时间

    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 设置date的startDate和endDate
    let rangeDate = util.rangeDate(185,280);
    if (rangeDate){
      this.setData({
        startDate: rangeDate[0],
        endDate: rangeDate[1]
      })
    }
   
    // 
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
    
    
  },
  handleSelector:function(e){
    console.log(e)
    this.setData({
      arrayIndex: e.detail.value
    })

  },
  // time
  bindTimeChange:function(e){
    console.log(e)
    this.setData({
      time: e.detail.value
    })
  },
  //date
  bindDateChange:function(e){
    console.log(e)
    this.setData({
      date: e.detail.value
    })
  },
  // 倒计时
  countdown: function () {
    let { expiredDate } = this.data
    let current = new Date().getTime();//当前时间
    if (current < expiredDate) {
      this.setData({
        timeLeftBargain: util.timeLeft(Math.floor((expiredDate - current) / 1000))
      })
      setTimeout(this.bargainCountdown, 500);
    }

  },
  // 弹出model
  openDateModule:function (params) {
    util.getDate(this)
    let animation = wx.createAnimation({
      duration:500,
      timingFunction: 'ease-in-out'
    })
    this.animation = animation;
    animation.translateY(-250).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual:'show',
      modelHeight: wx.getSystemInfoSync().windowHeight,
    })
  },
  // 关闭model
  closeDateModule:function (params) {
    this.animation.translateY(250).step()
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'hidden',
      modelHeight: '100%'
    })
  },
  // 确定
  confirmsDateModule:function (params) {
    const { valueInit, years, months, days, hours,minutes}  =this.data;
    // console.log(years, months, days, hours, minutes)
    if (valueInit){
      let dateValue = `${years[valueInit[0]]}/${months[valueInit[1]]}/${days[valueInit[2]]} ${hours[valueInit[3]]}:${minutes[valueInit[4]]}`
      console.log(dateValue, 'dateValue')
      this.setData({
        dateValue: dateValue
      })
    }
    this.closeDateModule()
  },
  bindDateChange: function (e) {
    // const val = e.detail.value;//返回的是对应的下标
    console.log(e,'e--val')
    console.log(this.data.valueInit, 'valueInit')
    this.setData({
      valueInit: e.detail.value
    })
  },
  // 

  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  }
  
})
