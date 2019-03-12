// pages/user/refund/iptNum/iptNum.js
let Refund = require('../../../utils/refund.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        iptState: false,
        iptNumss: null,//订单号
        iptName: null,//快递公司
        returnData: null,
        nameArr: null,//模糊查询
        nameArrStatus: false,
        stop: true,//阻止机制
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let returnData = {
            orderId: options.orderId,
            processInsId: options.processInsId,
            taskId: options.taskId
        }
        this.setData({
            returnData: returnData
        })
    },
    blurName: function () {
        Refund.couriers(null, 6, res => {
            console.log(res)
            this.setData({
                nameArr: res,
                nameArrStatus: true
            })
        })
    },
    inputName: function (e) {
        console.log(e.detail.value)
        if (e.detail.value) {
            Refund.couriers(e.detail.value, null, res => {
                console.log(res)
                this.setData({
                    nameArr: res,
                    nameArrStatus: true
                })
            })
        } else {
            this.setData({
                nameArr: null,
                nameArrStatus: false
            })
        }


    },
    changeName: function (e) {
        let iptName = {
            id: e.currentTarget.dataset.id,
            name: e.currentTarget.dataset.name
        }
        this.setData({
            iptName: iptName,
            nameArrStatus: false
        }, () => {
            console.log(this.data.iptName)
        })
    },
    iptNums: function (e) {
        // console.log(e.detail.value);
        this.setData({
            iptNumss: e.detail.value
        })
    },
    scanCodeBtn: function () {
        var _this = this;
        wx.scanCode({
            onlyFromCamera: true,
            success: function (res) {
                console.log(res.result, 231312312312);
                // 扫描后赋值
                _this.setData({
                    iptNumss: res.result
                }, () => {
                    console.log(_this.data.iptNumss)
                })
            },
            fail: function (req) {
                console.log(req)
            }
        })
    },
    createOrder: function () {
        if (!this.data.iptNumss || !this.data.iptName) {
            ErrorTips(this, '请填写必须参数');
        } else {
            let data = {
                "expressCourierId": this.data.iptName.id,
                "expressNo": this.data.iptNumss,
                "orderId": this.data.returnData.orderId,
                "processInsId": this.data.returnData.processInsId,
                "taskId": this.data.returnData.taskId,
                "sourceType": "1",
            }
            console.log(data);
            if (this.data.stop) {
                this.setData({
                    stop: false
                })
                Refund.createExpress(data, res => {
                    this.setData({
                        stop: true
                    })
                    console.log(res)
                    wx.navigateBack({
                        delta: 2
                    })
                })
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
    }, 3000);
}