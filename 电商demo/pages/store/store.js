// pages/store/store.js

const app = getApp()
const util = require('../../utils/util.js')
const API = require('../../utils/api.js')
let wxRequest = require('../../utils/wxRequest.js')
let AuthProvider = require('../../utils/AuthProvider.js');
let n = 10;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userMessage: {
            url: 'http://img.taopic.com/uploads/allimg/120727/201995-120HG1030762.jpg',
            userName: '栗子集市',
            description: '你想买的，不想买的，这里全部都有'
        },
        data2: {
            "pageSize": 10,
            "currentPage": 0
        },
        GoodSuggesst: null,
        GoodList: null,
        scene: null,
        stop: true, //阻止机制
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let scene = options.scene;
        this.setData({
            scene: options.scene
        })
        // // 获取今日推荐
        // let data1 = {
        //   "pageSize": 3,
        //   "currentPage": 0
        // }
        let data2 = {
            "pageSize": 10,
            "currentPage": 0
        }
        // wxRequest.fetch(API.tenantGoodSuggesst + scene, null, data1, "POST").then(res => {
        //   if (res.data.resultCode == 100) {
        //     this.setData({
        //       GoodSuggesst: res.data.resultContent
        //     })
        //   }
        // });
        wxRequest.fetch(API.changeSOL + scene, null, null, "GET").then(result => {
            if (result.data.resultCode == 100) {
                wxRequest.fetch(API.tenantGoodList + result.data.resultContent, null, data2, "POST").then(res => {
                    if (res.data.resultCode == 100) {
                        this.setData({
                            GoodList: res.data.resultContent,
                            scene: result.data.resultContent
                        })
                    }
                })
                wxRequest.fetch(API.tenantStore + result.data.resultContent, null, null, "GET").then(res => {
                    console.log(res)
                    if (res.data.resultCode == 100) {
                        this.setData({
                            userMessage: res.data.resultContent
                        })
                    }
                })
            }
        })
    },
    loadMoreList: function () {
        if (this.data.stop) {
            n += 10;
            this.setData({
                "data2.pageSize": n,
                stop: false
            }, () => {
                wxRequest.fetch(API.tenantGoodList + this.data.scene, null, this.data.data2, "POST").then(res => {
                    console.log(res)
                    if (res.data.resultCode == 100) {
                        this.setData({
                            GoodList: res.data.resultContent,
                            stop: true
                        })
                    }
                })
            })
        }
    },
    goToD: function (e) {
        console.log(e.currentTarget.dataset.id);
        wx.navigateTo({
            url: '/pages/PDetail/detail?scene=' + e.currentTarget.dataset.id
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
})