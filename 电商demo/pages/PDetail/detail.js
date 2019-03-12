// pages/find/detail/detail.js
const app = getApp()
const util = require('../../utils/util.js')
const API = require('../../utils/api.js')
let wxRequest = require('../../utils/wxRequest.js')
const WxParse = require('../../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据1
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    scrollState: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    productItem: {},
    showModalStatus: false, //自定义弹窗状态
    buyNumSelf: 1, //购买数量，默认是1，最大受限于商品剩余数量
    animationData: 0,
    currentName: '',
    goodsId: '', //有栗商品id
    supplierId: '', //供应商id
    shoppingModal: false,
    changeBtn: true,
    showScrollTop: false,
    scrollTop: 0,
    sku: {
      specStyle: [],
      specSku: [],
    },
    productDeatil: {},
    daset: '',
    popErrorMsg: '', //错误提示信息,
    HomeThisImg: '',
    forSell: false, //卖家菜单
    bottomShow: true, //卖家添加群投放显示
    firstIndex: -1,
    //准备数据  
    //数据结构：以一组一组来进行设定  
    commodityAttr: [],
    attrValueList: [],
    includeGroup: [],
    productMedias: [], //图片集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    // 根据当前商品id获取商品详情
    // 后面有借口直接通过交互传入商品id直接获取商品信息
    var url = API.goodDet + options.scene;
    wxRequest.fetch(url, null, null, 'GET').then(res => {
      if (res.data.resultCode == 100) {
        //当轮播图片大于6时，只显示6个。小于则全部显示
        // if (data.resultContent.photos.length > 6) {
        //     data.resultContent.photos = data.resultContent.photos.slice(0, 6);
        // }
        that.setData({
          HomeThisImg: res.data.resultContent.coverPhoto, //图片路劲
          productMedias: res.data.resultContent.productMedias,
          productItem: res.data.resultContent,
          currentName: res.data.resultContent.name,
          goodsId: res.data.resultContent.productId,
          'productDeatil.remainingQuantity': res.data.resultContent.inventory
          // tenantId: data.resultContent.tenantId,
          // supplierId: data.resultContent.supplierId,
          // daset: WxParse.wxParse('daset', 'html', data.resultContent.description, that, 0)
        });
        wx.setNavigationBarTitle({
          title: res.data.resultContent.name
        })
      }
      getSku(that, res.data.resultContent.id);
      getDiscription(that, res.data.resultContent.id);
    });
    // 获取SKU

    //调用应用实例的方法获取全局数据
    util.globalDatas(app, that);
    if (this.data.hasUserInfo) {
      this.changeButton()
    }
  },
  getUserInfo: function (e) {
    console.log(1)
    let self = this
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      console.log(11)
      wx.showModal({
        title: '用户授权',
        content: '本小程序需用户授权，请重新点击按钮授权。',
        mask: true,
        confirmColor: '#F45C43',
        success: function (res) { }
      })
    } else if (e.detail.errMsg == 'getUserInfo:ok') {
      console.log(22, e)
      app.globalData.userInfo = e.detail.userInfo;
      let userinfo = e.detail.userInfo;
      self.setData({
        userInfo: userinfo,
        "userMessage.userName": userinfo.nickName,
        "userMessage.imageUrl": userinfo.avatarUrl,
        hasUserInfo: true,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      })
      this.changeButton()
      wx.setStorageSync('userinfo', userinfo)
      util.login(app, self.data.encryptedData, self.data.iv)
    }
  },
  changeButton: function () {
    this.setData({
      changeBtn: false
    })
  },
  hideSell: function () {
    this.setData({
      forSell: false
    })
  },
  showScrollTop: function () {
    this.setData({
      showScrollTop: true
    })
  },
  hideScroll: function () {
    this.setData({
      showScrollTop: false
    })
  },
  scrollTop: function () {
    this.setData({
      scrollTop: 0
    })
  },
  orderNew: function () {
    // 立即购买
    var arr = selectSku(this, 1);
    console.log(arr);
    if (arr) {
      var goods = {
        productId: this.data.goodsId,
        quantity: this.data.buyNumSelf,
        skuId: arr.id
      }
      var goodss = [];
      goodss.push(goods)
      var goodsString = JSON.stringify(goodss);
      wx.navigateTo({
        url: '/pages/pay/pay?goods=' + goodsString,
      })
    }
  },
  shoppingModal: function () {
    let self = this
    self.showModal()
    self.setData({
      shoppingModal: true
    })
  },
  toBuyModal: function () {
    let self = this
    self.showModal()
    self.setData({
      shoppingModal: false
    })
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      scrollState: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        scrollState: false
      })
    }.bind(this), 200)
  },
  buyNumSelfMinus: function () {
    let num = this.data.buyNumSelf;
    num--;
    if (num < 1) {

    } else {
      this.setData({
        buyNumSelf: num
      })
    }
  },
  buyNumSelfAdd: function () {
    let arr = selectSku(this, 1);
    let maxNum;
    if (arr) {
      maxNum = arr.remainingQuantity;
    } else {
      maxNum = 99999;
    }
    // maxNum =1;
    let num = this.data.buyNumSelf;
    num++;
    if (num > maxNum) {
      ErrorTips(this, '不能再多了');
    } else {
      this.setData({
        buyNumSelf: num
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /* 获取数据 */
  distachAttrValue: function (commodityAttr) {
    // 把数据对象的数据（视图使用），写到局部内  
    var attrValueList = this.data.attrValueList;
    // 遍历获取的数据  
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].productSkuOvMap.length; j++) {
        var attrIndex = this.getAttrIndex(commodityAttr[i].productSkuOvMap[j].optionName, attrValueList);
        if (attrIndex >= 0) {
          // 如果属性值数组中没有该值，push新值；否则不处理  
          if (!this.isValueExist(commodityAttr[i].productSkuOvMap[j].optionValue, attrValueList[attrIndex].attrValues)) {
            attrValueList[attrIndex].attrValues.push(commodityAttr[i].productSkuOvMap[j].optionValue);
          }
        } else {
          attrValueList.push({
            attrKey: commodityAttr[i].productSkuOvMap[j].optionName,
            attrValues: [commodityAttr[i].productSkuOvMap[j].optionValue ?
              commodityAttr[i].productSkuOvMap[j].optionValue : commodityAttr[i].productSkuOvMap[j].optionName
            ]
          });
        }
      }
    }
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].attrValueStatus) {
          attrValueList[i].attrValueStatus[j] = true;
        } else {
          attrValueList[i].attrValueStatus = [];
          attrValueList[i].attrValueStatus[j] = true;
        }
      }
    }
    this.setData({
      attrValueList: attrValueList
    });
  },

  getAttrIndex: function (attrName, attrValueList) {
    // 判断数组中的attrKey是否有该属性值 
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrName == attrValueList[i].attrKey) {
        break;
      }
    }
    return i < attrValueList.length ? i : -1;
  },
  isValueExist: function (value, valueArr) {
    // 判断是否已有属性值  
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },
  /* 选择属性值事件 */
  selectAttrValue: function (e) {
    this.setData({
      buyNumSelf: 1
    })
    var attrValueList = this.data.attrValueList;
    var index = e.currentTarget.dataset.index; //属性索引  
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    if (e.currentTarget.dataset.status || index == this.data.firstIndex) {
      if (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value) {
        // 取消选中  
        this.disSelectValue(attrValueList, index, key, value);
      } else {
        // 选中  
        this.selectValue(attrValueList, index, key, value);
      }

    }
  },
  /* 选中 */
  selectValue: function (attrValueList, index, key, value, unselectStatus) {
    var includeGroup = [];
    if (index == this.data.firstIndex && !unselectStatus) { // 如果是第一个选中的属性值，则该属性所有值可选
      var commodityAttr = this.data.commodityAttr;
      // 其他选中的属性值全都置空  
      for (var i = 0; i < attrValueList.length; i++) {
        for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
          attrValueList[i].selectedValue = '';
        }
      }
    } else {
      var commodityAttr = this.data.includeGroup;
    }
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].productSkuOvMap.length; j++) {
        if (commodityAttr[i].productSkuOvMap[j].optionName == key && (commodityAttr[i].productSkuOvMap[j].optionValue ?
          commodityAttr[i].productSkuOvMap[j].optionValue : commodityAttr[i].productSkuOvMap[j].optionName) == value) {
          includeGroup.push(commodityAttr[i]);
        }
      }
    }
    attrValueList[index].selectedValue = value;
    // 判断属性是否可选  
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        attrValueList[i].attrValueStatus[j] = false;
      }
    }
    for (var k = 0; k < attrValueList.length; k++) {
      for (var i = 0; i < includeGroup.length; i++) {
        for (var j = 0; j < includeGroup[i].productSkuOvMap.length; j++) {
          if (attrValueList[k].attrKey == includeGroup[i].productSkuOvMap[j].optionName && includeGroup[i].remainingQuantity > 0) {
            for (var m = 0; m < attrValueList[k].attrValues.length; m++) {
              if (attrValueList[k].attrValues[m] == includeGroup[i].productSkuOvMap[j].optionValue) {
                attrValueList[k].attrValueStatus[m] = true;
              }
            }
          }
        }
      }
    }
    this.setData({
      attrValueList: attrValueList,
      includeGroup: includeGroup
    });
    var count = 0;
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].selectedValue) {
          count++;
          break;
        }
      }
    }
    if (count < 2) {
      // 第一次选中，同属性的值都可选  
      this.setData({
        firstIndex: index
      });
    } else {
      this.setData({
        firstIndex: -1
      });
    }
    selectSku(this, 0)
  },
  /* 取消选中 */
  disSelectValue: function (attrValueList, index, key, value) {
    var commodityAttr = this.data.commodityAttr;
    attrValueList[index].selectedValue = '';
    // 判断属性是否可选  
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        attrValueList[i].attrValueStatus[j] = true;
      }
    }
    this.setData({
      includeGroup: commodityAttr,
      attrValueList: attrValueList,
      "productDeatil.valueSku": '请选择属性'
    });
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrValueList[i].selectedValue) {
        this.selectValue(attrValueList, i, attrValueList[i].attrKey, attrValueList[i].selectedValue, true);
      }
    }
  },
})

function getSku(that, id) {
  var url = API.goodsDetail + id + '/sku';
  wxRequest.fetch(url, null, null, 'GET').then(res => {
    if (res.data.resultCode == 100) {
      var productDeatil = {
        img: that.data.HomeThisImg,
        price: res.data.resultContent[0].retailPrice,
        name: res.data.resultContent[0].name,
        valueSku: '请选择属性',
        remainingQuantity: that.data.productDeatil.remainingQuantity
      }
      that.setData({
        includeGroup: res.data.resultContent,
        commodityAttr: res.data.resultContent,
        productDeatil: productDeatil
      });
      that.distachAttrValue(res.data.resultContent);
      // 只有一个属性组合的时候默认选中  
      if (res.data.resultContent.length == 1) {
        for (var i = 0; i < res.data.resultContent[0].productSkuOvMap.length; i++) {
          that.data.attrValueList[i].selectedValue = res.data.resultContent[0].productSkuOvMap[i].optionValue ? res.data.resultContent[0].productSkuOvMap[i].optionValue : res.data.resultContent[0].productSkuOvMap[i].optionName;
        }
        var productDeatil = {
          img: that.data.HomeThisImg,
          price: res.data.resultContent[0].retailPrice,
          name: res.data.resultContent[0].name,
          valueSku: that.data.attrValueList[0].selectedValue,
          remainingQuantity: res.data.resultContent[0].remainingQuantity
        }
        that.setData({
          attrValueList: that.data.attrValueList,
          productDeatil: productDeatil
        });
      }
    }
  })
}
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

function pushSku(valArr, arr) {
  let a = [];
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].productSkuOvMap.length; j++) {
      if (valArr === arr[i].productSkuOvMap[j].optionValue) {
        a.push(arr[i]);
      }
    }
  }
  return a;
}

function selectSku(that, num) {
  var value = [];
  let a = [];
  for (var i = 0; i < that.data.attrValueList.length; i++) {
    if (!that.data.attrValueList[i].selectedValue) {
      break;
    }
    value.push(that.data.attrValueList[i].selectedValue);
  }
  if (i < that.data.attrValueList.length) {
    if (num === 1) {
      ErrorTips(that, '请完善属性');
    }
  } else {
    var commodityAttr = that.data.commodityAttr;
    switch (value.length) {
      case 1:
        for (var i = 0; i < commodityAttr.length; i++) {
          if (commodityAttr[i].productSkuOvMap[0].optionValue) {
            if (value[0] === commodityAttr[i].productSkuOvMap[0].optionValue) {
              a = [];
              a.push(commodityAttr[i]);
            }
          } else {
            a = [];
            a.push(commodityAttr[i]);
          }
        }
        break;
      case 2:
        a = pushSku(value[1], pushSku(value[0], commodityAttr));
        break;
      case 3:
        a = pushSku(value[2], pushSku(value[1], pushSku(value[0], commodityAttr)));
        break;
      case 4:
        a = pushSku(value[3], pushSku(value[2], pushSku(value[1], pushSku(value[0], commodityAttr))));
        break;
      case 5:
        a = pushSku(value[4], pushSku(value[3], pushSku(value[2], pushSku(value[1], pushSku(value[0], commodityAttr)))));
        break;
      case 6:
        a = pushSku(value[5], pushSku(value[4], pushSku(value[3], pushSku(value[2], pushSku(value[1], pushSku(value[0], commodityAttr))))))
        break;
    }
    a[0].valueSku = value.join('，');
    var productDeatil = {
      img: that.data.HomeThisImg,
      price: a[0].retailPrice,
      name: a[0].name,
      valueSku: value.join('，'),
      remainingQuantity: a[0].remainingQuantity
    }
    that.setData({
      productDeatil: productDeatil
    })
  }
  if (a[0] && !a[0].remainingQuantity) {
    ErrorTips(that, '库存不足');
  } else {
    return a[0];
  }

}

function getDiscription(that, id) {
  wxRequest.fetch(API.goodsDiscription + id, null, null, 'GET').then(res => {
    WxParse.wxParse('daset', 'html', res.data.resultContent, that, 0);
    console.log(res.data.resultContent)
  })
}