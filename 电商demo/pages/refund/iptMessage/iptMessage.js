// pages/user/refund/iptMessage/iptMessage.js
const app = getApp()
const util = require('../../../utils/util.js')
const API = require('../../../utils/api.js')
let AuthProvider = require('../../../utils/AuthProvider.js')
let wxUploadFile = require('../../../utils/uploadFile.js')
let wxRequest = require('../../../utils/wxRequest.js')
let Refund = require('../../../utils/refund.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        iptMessageBtnState: true, //按钮状态
        imgState: true, //上传图片状态
        refundMoney: null,//退款金额
        refundPhoneNum: null,//联系电话
        StateArrayStatus: false,//退款状态显示状态
        StateArray: ['收到货', '未收到货'], //退款状态数组
        StateIndex: null, //退款状态index
        StateValue: null, //退款状态
        // ReasonArrayStatus:false,//退款原因显示状态
        ReasonArray: [], //退款原因数组
        ReasonArrays: [], //退款原因数组
        ReasonValueId: null, //退款原因id
        ReasonIndex: null, //退款原因index
        ReasonValue: null, //退款原因
        ReasonsValue: null, //说明
        ImgArray: [], //图片数组
        medias: [], //图片数据
        orderDetail: '',
        moneyMax: '',//请求数据
        MaxData: 0,//最大金额
        popErrorMsg: null,//错误提示
        refundItems: null,
        stop: true,//阻止机制
        serviceArray: ["客服不介入", "客服介入"],
        serviceIndex: null, //客服介入index
        serviceValue: null, //客服介入值
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.refundStutas, '传过来')
        if (options.orderid) {
            let url = `${API.orderDetail}purchaseInsId=${options.purid}&orderId=${options.orderid}`
            AuthProvider.getAccessToken().then(token => {
                return wxRequest.fetch(url, {type: 'bearer', value: token}, null, "GET")
            }).then(res => {
                console.log(res);
                if (res.data.resultCode == 100) {
                    let resultContent = res.data.resultContent;
                    let items = resultContent.items;
                    let goodsItems = [];
                    let refundItems = [];
                    for (let i = 0; i < items.length; i++) {
                        goodsItems.push({itemId: items[i].skuId, quantity: items[i].quantity});
                        refundItems.push({
                            "commenrcialItemId": items[i].commercialItemId,
                            "skuId": items[i].skuId,
                            "quantity": items[i].quantity
                        })
                    }
                    let moneyMax = {
                        goodsItems: goodsItems,
                        orderId: options.orderid,
                        purchaseInsId: options.purid
                    }
                    this.setData({
                        orderDetail: resultContent,
                        moneyMax: moneyMax,
                        refundItems: refundItems
                    });
                    Refund.loadAmountUpperLimit(moneyMax, res => {
                        console.log(res, '最大金额')
                        this.setData({
                            MaxData: res.refundAmount
                        })
                    })
                }
            }).catch(req => {
                console.log(req)
            })
        }
        if (options.refundStutas == '0') {
            Refund.loadRefundReasons(3, res => {
                console.log(res)
                let ReasonArray = [];
                res.map(item => {
                    ReasonArray.push(item.name)
                });
                this.setData({
                    ReasonArray: ReasonArray,
                    ReasonArrays: res
                });
            })
        }
        this.setData({
            StateArrayStatus: Number(options.refundStutas)
        })
        if (options.refundStutas == '2') {
            Refund.loadRefundReasons(2, res => {
                console.log(res)
                let ReasonArray = [];
                res.map(item => {
                    ReasonArray.push(item.name)
                });
                this.setData({
                    ReasonArray: ReasonArray,
                    ReasonArrays: res
                });
            })
        }
    },
    addImg: function (e) {
        // 添加图片
        var _this = this;
        wx.chooseImage({
            count: 5 - _this.data.ImgArray.length,
            success: function (res) {
                console.log(res);
                _this.setData({
                    imgState: false
                    // ImgArray: res.tempFilePaths
                });
                res.tempFilePaths.map(imgUrl => {
                    AuthProvider.getAccessToken().then(token => {
                        return wxUploadFile.uploadFile(API.uploadImg, imgUrl, token);
                    }).then(result => {
                        let resData = JSON.parse(result.data);
                        if (resData.resultCode == 100) {
                            console.log(resData.resultContent);
                            let ImgArray = _this.data.ImgArray;
                            ImgArray.push(resData.resultContent);
                            // dtImg.push(resData.resultContent);
                            _this.setData({
                                ImgArray: ImgArray
                            }, () => {
                                let medias = [];
                                for (let i = 0; i < _this.data.ImgArray.length; i++) {
                                    medias.push({
                                        mediaId: _this.data.ImgArray[i].id,
                                        mediaPath: _this.data.ImgArray[i].url,
                                        seqNo: i,
                                        type: 0
                                    })
                                }
                                _this.setData({
                                    medias: medias
                                })
                            })
                        }
                    }).catch(req => {
                        console.log(req)
                    })
                })

            }
        })
    },
    delImg: function (e) {
        //删除图片
        // console.log(e.target.dataset.value);
        var a = this.data.ImgArray
        a.splice(e.target.dataset.value, 1);
        this.setData({
            ImgArray: a
        }, () => {
            let medias = [];
            for (let i = 0; i < this.data.ImgArray.length; i++) {
                medias.push({
                    mediaId: this.data.ImgArray[i].id,
                    mediaPath: this.data.ImgArray[i].url,
                    seqNo: i,
                    type: 0
                })
            }
            this.setData({
                medias: medias
            })
        })
        if (a.length <= 0) {
            this.setData({
                imgState: true
            })
        }
    },
    changerefundMoney: function (e) {
        // console.log(e)
        this.setData({
            refundMoney: e.detail.value
        })
    },
    configrefundMoney: function (e) {
        if (e.detail.value) {
            this.setData({
                refundMoney: Number(e.detail.value).toFixed(2)
            }, () => {
                if (parseFloat(this.data.refundMoney) > parseFloat(this.data.MaxData)) {
                    ErrorTips(this, '金额大于最大退款金额');
                }
            })
        }
    },
    foucusrefundeMoneny: function () {
        this.setData({
            refundMoney: null
        })
    },
    changerefundPhoneNum: function (e) {
        this.setData({
            refundPhoneNum: e.detail.value
        })
    },
    catchchangeState: function (e) {
        // console.log(e);
        this.setData({
            StateValue: this.data.StateArray[e.detail.value]
        });
        if (this.data.StateArrayStatus != '2') {
            console.log('退款退货')
            Refund.loadRefundReasons(e.detail.value, res => {
                console.log(res)
                let ReasonArray = [];
                res.map(item => {
                    ReasonArray.push(item.name)
                });
                this.setData({
                    ReasonArray: ReasonArray,
                    ReasonArrays: res
                });
            })
        } else {
            console.log('补发')
        }
        // 退款状态
    },
    catchchangeReason: function (e) {
        console.log(this.data.ReasonArrays);
        this.setData({
            ReasonValue: this.data.ReasonArray[e.detail.value]
        }, () => {
            for (let i = 0; i < this.data.ReasonArrays.length; i++) {
                if (this.data.ReasonArrays[i].name == this.data.ReasonValue) {
                    this.setData({
                        ReasonValueId: this.data.ReasonArrays[i].id
                    }, () => {
                        console.log(this.data.ReasonValueId);
                    })
                }
            }
        });
        // 退款原因
    },
    reasonsIpt: function (e) {
        // console.log(e.detail);
        this.setData({
            ReasonsValue: e.detail.value
        })
        // 退款说明
    },
    catchchangeService: function (e) {
        "use strict";
        console.log(e.detail.value, '客服介入');
        this.setData({
            serviceIndex: e.detail.value,
            serviceValue: this.data.serviceArray[e.detail.value]
        })
    },
    submitRefund: function () {
        let data = {
            customerInterveneFlag: this.data.serviceIndex ? true : false,
            comments: this.data.ReasonsValue,
            medias: this.data.medias,
            orgContactPhone: this.data.refundPhoneNum,
            orgRefundAmount: this.data.refundMoney,
            purchaseId: this.data.moneyMax.purchaseInsId,
            purchaseOrderId: this.data.moneyMax.orderId,
            receivedFlag: this.data.StateIndex == 1 ? false : true,
            refundItems: this.data.refundItems,
            refundReasonDesc: this.data.ReasonValue,
            refundReasonId: this.data.ReasonValueId,
            refundType: this.data.StateArrayStatus != 2 ? this.data.StateArrayStatus : 3
        }
        if (!data.orgContactPhone || !data.refundReasonId) {
            ErrorTips(this, '请填写相关数据');
        } else {
            console.log(data.orgRefundAmount)
            console.log(this.data.MaxData)
            if (parseFloat(data.orgRefundAmount) > parseFloat(this.data.MaxData)) {
                ErrorTips(this, '金额大于最大退款金额');
            } else {
                // ErrorTips(this, '金额小于最大退款金额');
                if (this.data.stop) {
                    this.setData({
                        stop: false
                    })
                    Refund.refundSubmit(data, res => {
                        this.setData({
                            stop: true
                        })
                        console.log(res)
                        if (res.resultCode == '02510022') {
                            ErrorTips(this, '申请退款金额无效');
                        } else if (res.resultCode == '02510016') {
                            ErrorTips(this, '订单不支持退款');
                        } else if (res.resultCode == 100) {
                            console.log(res.resultContent);
                            wx.navigateTo({
                                url: '/pages/refund/refund'
                            })
                        } else if (res.resultCode == '02510001') {
                            ErrorTips(this, '申请售后失败');
                        } else {
                            ErrorTips(this, '未知异常');
                        }
                    })
                }
            }

        }
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

    }
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
    }, 3000);
}