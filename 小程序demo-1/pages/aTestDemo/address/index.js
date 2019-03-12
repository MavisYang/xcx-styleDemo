//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js')
// 引入获取地址的 http://lbs.qq.com/qqmap_wx_jssdk/index.html
const QQMapWX = require('../../../qqmap-wx-jssdk/qqmap-wx-jssdk')
var qqmapsdk;
// 实例化API核心类
qqmapsdk = new QQMapWX({
  key: 'BJFBZ-ZFTHW-Y2HRO-RL2UZ-M6EC3-GMF4U'
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromData: {
      name: 11,
      address: '',
    },
    userAdr: ['广东省', '广州市', '海珠区'],
    adrDetail: '',
    poiAddress:'',
    // 动态获取
    modelHeight:'100%',
    areaSelectedStr:'',
    current: 0,
    // animation
    maskVisual: 'hidden',
    animationData: '',
    // list
    province: [],
    city: [],
    region: [],
    town: [],
    // name
    provinceName: '请选择',
    cityName:'',
    regionName:'',
    townName:'',
    // index
    provinceIndex:0,
	  cityIndex: -1,
    regionIndex: -1,
    townIndex: -1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // 初始化获取省列表
    qqmapsdk.getCityList({
          success: function (res) {
            _this.setData({
              province: res.result[0]
            })
          },
          fail: function (res) {
            console.log('get province fail');
          }
    });
    wx.getWeRunData({
      success:function(res){
        console.log(res)
        
      }
    })
  },
  
  // 添加名称
  changeName: function (e) {
    // console.log(e);
    this.setData({
      'fromData.name': e.detail.value
    })
  },
  // 添加地址
  changeAdr() {
    let _this = this;
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          console.log('address res', res);
          let adr = res.provinceName + res.cityName + res.countyName + res.detailInfo;
          _this.setData({
            'fromData.address': adr
          })
        },
        fail: function (req) {//用户取消获取地址
          wx.showModal({
            title: '提示',
            content: '您未正确选择地址，将无法使用收货地址，请重新授权或选择地址',
            mask: true,
            confirmColor: '#F45C43',
            success: function (res) {
              if (res.confirm) { //确定按钮
                //打开授权开关界面，让用户手动授权
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting['scope.address']) {
                      wx.chooseAddress({
                        success: res => {
                          console.log(res);
                          let adr = res.provinceName + res.cityName + res.countyName + res.detailInfo;
                          _this.setData({
                            'fromData.address': adr
                          })
                        }
                      })
                    } else {
                      console.log('reject authrize');
                    }
                  }
                })

              } else if (res.cancel) {//取消按钮
                // 跳转选择地址页面


              }
            }
          })
          console.log('address req fail', req);

        }
      })
    } else {
      console.log('当前微信版本不支持chooseAddress');
    }

  },

  // picker 选择地址
  bindUserAdrChange(e) {
    console.log(e);
    this.setData({
      userAdr: e.detail.value
    })
  },
  // 详情地址
  bindadrDetail: function (e) {
    this.setData({
      adrDetail: e.detail.value
    })
  },
  // 自动获取当前位置
  fetchPOI: function () {
    let self = this;
    console.log(0)
        // 调用接口
    qqmapsdk.reverseGeocoder({
      poi_options: 'policy=2',
      get_poi: 1,
      success: function (res) {
        console.log(res,'res');//返回的数据：address(地址) location(经纬度) pois (附近)
        if (res.message =='query ok'){
          console.log(1)
          self.setData({
            poiAddress: res.result.address
          });
        }
       
      },
      fail: function (res) {
        //         console.log(res);
      },
      complete: function (res) {
        //         console.log(res);
      }
    })
  },
  /** 
   * 模仿淘宝地址选择效果
  */
  // 开启model
  cascadePopup: function (e) {
    let animation = wx.createAnimation({
      duration:500,
      timingFunction:'ease-in-out'
    })
    this.animation = animation;
    animation.translateY(-285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual:'show',
      modelHeight: wx.getSystemInfoSync().windowHeight
    })
  },
  // 关闭model
  cascadeDismiss:function (e) {
    this.animation.translateY(285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'hidden',
      modelHeight: '100%'
    })
  },
  // 修改
  changeCurrent:function(e){
    this.setData({
      current: e.currentTarget.dataset.current
    })
  },
  currentChanged: function (e) {
    // swiper滚动使得current值被动变化，用于高亮标记
    this.setData({
        current: e.detail.current
    });
  },
  // 通过id值获取市、区、县等
  getDistrictByCityId(id,callback) {
    qqmapsdk.getDistrictByCityId({
      id: id, // 对应城市ID
      success: function (res) {
        callback(res.result[0])
      },
      fail: function(req) {
        callback(req)
      }
    });
  },
  // 选择省 一级
  provinceTapped:function(e){
    let _this = this;
    const {id,index} =  e.currentTarget.dataset
    // 显示header内容
    // console.log('province',_this.data.province);
    _this.setData({
      provinceName: _this.data.province[index].fullname,
      provinceIndex:index,
      regionName: '',
      townName: '',
      cityIndex: -1,
      regionIndex: -1,
      townIndex: -1,
      region: [],
      town: []
    })
    this.getDistrictByCityId(id,(res)=>{
      _this.setData({ 
        city:res,
        cityName: '请选择'
      })
      // 确保生成了数组数据再移动swiper
      _this.setData({
        current: 1
      })
    })
    
  },
  //  选择市 二级
  cityTapped:function(e){
    let _this = this;
    const { id, index } = e.currentTarget.dataset
    // 显示header内容
    _this.setData({
      cityName: _this.data.city[index].fullname,
      cityIndex: index,
      regionIndex: -1,
      townIndex: -1,
      regionName: '',
      townName: '',
      town: []
    })
    this.getDistrictByCityId(id, (res) => {
      _this.setData({
        region: res,
        regionName: '请选择',
      })
      // 确保生成了数组数据再移动swiper
      _this.setData({
        current: 2
      })
    })
    
  },
  //  选择区 三级
  regionTapped: function (e) {
    let _this = this;
    const { id, index } = e.currentTarget.dataset
    // 显示header内容
    // console.log('region', _this.data.region);
    _this.setData({
      regionName: _this.data.region[index].fullname,
      regionIndex: index,
      townIndex: -1,
      townName: ''
    })
    // // 假如没有镇一级了，关闭悬浮框，并显示地址
    this.getDistrictByCityId(id, (res) => {
      if (res.status==363){
        const { provinceName, cityName, regionName } = _this.data
        _this.setData({
          areaSelectedStr: provinceName + cityName + regionName
        });
        _this.cascadeDismiss();
        return;
      }
      _this.setData({
        town: res,
        townName: '请选择',
      })
      // // 确保生成了数组数据再移动swiper
      _this.setData({
        current: 3
      })
    })
    
  },
  // 选择街道 四级
  townTapped:function (e) {
    let _this = this;
    const { id, index } = e.currentTarget.dataset;
    // console.log('town', _this.data.town);
    // 显示header内容
    _this.setData({
      townName: _this.data.town[index].fullname,
      townIndex: index,
    },()=>{
      const { provinceName, cityName, regionName, townName } = _this.data
      _this.setData({
        areaSelectedStr: provinceName + cityName + regionName + townName
      })
      _this.cascadeDismiss();
    })
  },
  /** 
   * form formSubmit /formReset
  */
  formSubmit:function (e) {
    console.log('formSubmit',e);
    let formData = e.detail.value;
    if (!formData.switch){
      util.failModel('switch未选中')
      return
    }
    if (formData.slider==''){
      util.failModel('请选择slider')
      return
    }
    if (formData.input == ''){
      util.failModel('请输入手机号')
      return
    }
    if (!/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(formData.input)){
      util.failModel('手机号格式错误')
      return
    }
    if (formData.radio==''){
      util.failModel('请选择radio')
      return
    }
    if (formData.checkbox.length==0){
      util.failModel('请选择checkbox')
      return
    }
    util.successModel('保存成功')
  },
  formReset: function (e) {
    console.log('formReset', e);
    util.successModel('重置成功')

  },
  switchChange:function(e){
    console.log(e.detail.value,'value');
    
  }
})
