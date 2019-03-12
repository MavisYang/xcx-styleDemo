// pages/find/pay/pay.js6768
let app = getApp()
let util = require("../../utils/util.js")
let API = require('../../utils/api.js')
let Pay = require('../../utils/pay.js')
let wxRequest = require('../../utils/wxRequest.js')
let AuthProvider = require('../../utils/AuthProvider.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsItem: [], //商品局部信息
        adrStyle: true, //地址状态
        userName: '',
        provinceName: '',
        cityName: '',
        countyName: '',
        detailInfo: '',
        telNumber: '',
        onlyGoods: true,
        AdrId: '',
        returnGoods: '',//返回携带参数
        IdCard: '',//身份证号码
        IdName: '',//姓名
        isAbroadFlag: 0,//是否是境外商品
        comments: '',//备注
        popErrorMsg: '',//错误提示
        checkStatus: 0,//商品是否通过校验 1校验曾成功 2库存不足 3商品过期,
        wxPayData: '',//支付参数batchid
        stop: true,//阻止机制
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取传输过来的商品购买信息
        // console.log(options);
        let _this = this;
        if (options.AdrId) {
            AuthProvider.getAccessToken().then(token => {
                return wxRequest.fetch(API.getAdrDetail + options.AdrId + '/assemble', { type: 'bearer', value: token }, null, "GET");
            }).then(res => {
                if (res.data.resultCode == 100) {
                    this.setData({
                        provinceName: res.data.resultContent.provinceName,
                        userName: res.data.resultContent.contactor,
                        cityName: res.data.resultContent.cityName,
                        countyName: res.data.resultContent.countyName,
                        telNumber: res.data.resultContent.contactTel,
                        detailInfo: res.data.resultContent.detailAddr,
                        AdrId: options.AdrId,
                        adrStyle: false
                    })
                }
            })
        }
        if (options.goods) {
            var goods = JSON.parse(options.goods);
            Pay.confirmOrder(goods, res => {
                _this.setData({
                    goodsItem: res,
                    returnGoods: goods,
                    isAbroadFlag: res.orderSimpleInfo[0].abroadFlag,
                    checkStatus: res.orderSimpleInfo[0].checkStatus
                })
            })
            //isAbroadFlag 判断是否是境外商品
        }
        console.log(options.goods, '获取传输过来的商品购买信息');
        console.log(options.AdrId, '获取传输过来的地址id');

    },
    //选择地址
    editAddress: function () {
        let self = this
        if (wx.chooseAddress) {
            wx.chooseAddress({
                success: res => {
                    console.log(JSON.stringify(res))
                    var obj = {
                        "cityName": res.cityName,
                        "contactTel": res.telNumber,
                        "contactor": res.userName,
                        "countyName": res.countyName,
                        "detailAddr": res.detailInfo,
                        "postCode": res.postalCode,
                        "provinceName": res.provinceName,
                        "type": "2"
                    }
                    self.setData({
                        userName: res.userName,
                        provinceName: res.provinceName,
                        cityName: res.cityName,
                        countyName: res.countyName,
                        detailInfo: res.detailInfo,
                        telNumber: res.telNumber,
                        adrStyle: false,
                    })
                    //获取地址id
                    AuthProvider.getAccessToken().then(token => {
                        return wxRequest.fetch(API.getAdrId, { type: 'bearer', value: token }, obj, "POST");
                    }).then(res => {
                        if (res.data.resultCode == 100) {
                            self.setData({
                                AdrId: res.data.resultContent
                            })
                        }
                    })
                },
                fail: err => {
                    console.log(JSON.stringify(err))
                    if (err.errMsg == 'chooseAddress:cancel') {
                        return
                    }
                    wx.showModal({ // 向用户提示需要权限才能继续
                        title: '提示',
                        content: '您未正确选择地址，将无法使用收货地址，请重新授权或选择地址',
                        mask: true,
                        confirmColor: '#F45C43',
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                                wx.openSetting({ //打开授权开关界面，让用户手动授权
                                    success: (res) => {
                                        console.log(res)
                                        if (res.authSetting["scope.address"]) {
                                            wx.chooseAddress({
                                                success: res => {
                                                    console.log(res)
                                                    var obj = {
                                                        "cityName": res.cityName,
                                                        "contactTel": res.telNumber,
                                                        "contactor": res.userName,
                                                        "countyName": res.countyName,
                                                        "detailAddr": res.detailInfo,
                                                        "postCode": res.postalCode,
                                                        "provinceName": res.provinceName,
                                                        "type": "2"
                                                    }
                                                    self.setData({
                                                        userName: res.userName,
                                                        provinceName: res.provinceName,
                                                        cityName: res.cityName,
                                                        countyName: res.countyName,
                                                        detailInfo: res.detailInfo,
                                                        adrStyle: false,
                                                    })
                                                    //获取地址id
                                                    AuthProvider.getAccessToken().then(token => {
                                                        return wxRequest.fetch(API.getAdrId, { type: 'bearer', value: token }, obj, "POST");
                                                    }).then(res => {
                                                        if (res.data.resultCode == 100) {
                                                            self.setData({
                                                                AdrId: res.data.resultContent
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        } else {
                                            console.log('reject authrize')
                                        }
                                    }
                                })
                            } else if (res.cancel) {
                                wx.redirectTo({
                                    url: `/pages/adr/index?getAdr=1&goods=${JSON.stringify(self.data.returnGoods)}`
                                })
                            }
                        }
                    })
                }
            })
        } else {
            console.log('当前微信版本不支持chooseAddress');
        }
    },
    //提交支付，支付
    paySubmitBox: function () {
        let self = this;
        if (self.data.checkStatus == 1) {
            if (self.data.adrStyle) {
                wx.showModal({
                    title: '温馨提示',
                    content: '你还未选择地址，请先选择收货地址。',
                    mask: true,
                    onfirmColor: '#F45C43',
                    success: res => {
                        console.log(res);
                    }
                })
            } else if (self.data.isAbroadFlag != 0 && !self.data.IdCard) {
                ErrorTips(self, '境外商品需要身份信息')
            } else {
                if (this.data.stop) {
                    this.setData({
                        stop: false
                    })
                    rPrice(self, res => {
                        console.log(res)
                        Pay.WChactPay(res, result => {
                            console.log(result);
                            console.log("支付=>");
                            Pay.requestPayment(result, res.batchId);
                            this.setData({
                                stop: true
                            })
                        })
                    })
                }
            }
        } else if (self.data.checkStatus == 2) {
            ErrorTips(self, '库存不足');
        } else if (self.data.checkStatus == 3) {
            ErrorTips(self, '商品过期');
        }
    },
    //input买家留言，记录
    changeComments: function (e) {
        // console.log(e.detail.value);
        this.setData({
            comments: e.detail.value,
        })
    },
    //境外产品填写身份证号码
    goEditIdCard: function () {
        if (this.data.isAbroadFlag != 0) {
            wx.navigateTo({
                url: '/pages/IdCard/IdCard'
            })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (wx.getStorageSync('IdNo') && this.data.isAbroadFlag != 0) {
            this.setData({
                IdCard: wx.getStorageSync('IdNo'),
            })
        }
        if (wx.getStorageSync('IdName') && this.data.isAbroadFlag != 0) {
            this.setData({
                IdName: wx.getStorageSync('IdName'),
            })
        }
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
})
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
function rPrice(self, callback) {
    let datas = {
        "splitOrderInfos": [{
            "comments": self.data.comments ? self.data.comments : null,
            "goodsSimpleInfos": [{
                "productId": self.data.goodsItem.orderSimpleInfo[0].goodsSkuInfos[0].productId,
                "quantity": self.data.goodsItem.orderSimpleInfo[0].goodsSkuInfos[0].quantity,
                "skuId": self.data.goodsItem.orderSimpleInfo[0].goodsSkuInfos[0].skuId
            }],
            "orderNo": self.data.goodsItem.orderSimpleInfo[0].orderNo
        }],
        "sourceSys": 2,
        "persionalId": self.data.IdCard ? self.data.IdCard : null,
        "sourceType": 4,
        "toAddrId": self.data.AdrId
    }
    Pay.buyOrder(datas, res => {
        if (res.resultCode === '03814908') {
            ErrorTips(self, '收货地址不在配送区');
            self.setData({
                stop: true
            })
            return;
        } else if (res.resultCode != 100) {
            ErrorTips(self, res.detailDescription);
            self.setData({
                stop: true
            })
            return;
        }
        /**
         * 03814902        订单拆分异常      
03814903     收货地址异常  
03814904   身份证号为空  
05814905   身份证号格式错误  
05814906   商品过期   
03814907        商品库存不足
         */
        self.setData({
            "goodsItem.orderSimpleInfo[0].billTicketInfo.expressPrice": res.resultContent.commercialGroupInfo.expressPrice,
            "goodsItem.totalBillInfo.realChargePrice": res.resultContent.commercialGroupInfo.realChargePrice,
            stop: true,
            wxPayData: {
                "openId": wx.getStorageSync('openid'),
                "appid": API.APP_ID,
                "batchId": res.resultContent.paymentInfo.id,
                "billDetails": [{
                    "amount": res.resultContent.commercialGroupInfo.realChargePrice,
                    "paymentType": "3",
                    "relatedItemId": null,//代金券或优惠券ID；暂无
                    "seqNo": null//代金券或优惠券的顺序；暂无
                }],
                "payType": "3",
                "tradeType": "JSAPI"
            }
        }, () => {
            callback(self.data.wxPayData)
        })
    })
}