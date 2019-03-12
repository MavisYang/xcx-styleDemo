//index.js
//获取应用实例
const app = getApp()
// 引入截图js
import WeCropper from '../../../we-cropper/we-cropper.js'
const device = wx.getSystemInfoSync()// 获取设备信息
const width = device.windowWidth;// 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight - 50;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperStatus:false,
    cropperOpt:{
      id: 'cropper',
      width,  // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 300) / 2, // 裁剪框x轴起点
        y: (width - 150) / 2, // 裁剪框y轴期起点
        width: 300, // 裁剪框宽度
        height: 300 // 裁剪框高度
      }
    },
    imgUrl: null,//初始图片地址
    imgUrls:[],
    activeImg:'',
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // console.log(this.data.fromData.name);
    // this.setData({
    //   'fromData.name':'21212'
    // },()=>{
    //   console.log(this.data.fromData.name,22);
    // })
    
    this.paintCanvas();
    // 裁剪
    const {cropperOpt} =this.data
    // 若同一个页面只有一个裁剪容器，在其它Page方法中可通过this.wecropper访问实例
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        // console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        // console.log(`before picture loaded, i can do something`)
        // console.log(`current canvas context: ${ctx}`)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        // console.log(`picture loaded`)
        // console.log(`current canvas context: ${ctx}`)
        wx.hideToast()
      })   
  },
  // 截图 
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  // 缩放调整画布中的图片直到满意的状态，点击生成图片按钮，导出图片
  getCropperImage() {
    let _this=this;
    this.wecropper.getCropperImage((src) => {
      if (src) {
        console.log(src,'src');
        
        // 截图图片处理
        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 1000,
        })
        setTimeout(() => {
          _this.setData({
            cropperStatus: false
          })
        }, 1001);
       
        
        // wx.previewImage({
        //   current: '', // 当前显示图片的http链接
        //   urls: [src] // 需要预览的图片http链接列表
        // })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  // 载入图片 惰性载入
  uploadTap(e) {
    let type = e.currentTarget.dataset.type
    console.log(type,'type');
    const self = this
    let { imgUrls, activeImg} = self.data
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        if(type==1){//添加图片
          imgUrls.push(src)
        } else if (type == 2) {//点击更换图片
          let index = imgUrls.indexOf(activeImg)
          imgUrls.splice(index,1,src)
        }
        self.setData({
          imgUrls: imgUrls,
          cropperStatus: true,
          activeImg: src
        })
        // console.log('imgUrls', imgUrls);
        self.wecropper.pushOrign(src)
      }
    })
  },
  // 选中图片
  activeUploadImg(e){
    let currentImg = e.target.dataset.src
    this.setData({
        activeImg: e.target.dataset.src
    })
  },
  // 删除图片
  deleteUploadImg:function(e) {
    console.log(e,'e');
    const { imgUrls, activeImg}=this.data
    var currentImg = e.currentTarget.dataset.src
    let index = imgUrls.indexOf(activeImg)
    imgUrls.splice(index, 1);//返回删除之后剩下的数据
    //imgUrls.splice(currentImg,1);//返回删除的数据
    this.setData({
      imgUrls: imgUrls,
      activeImg:''
    })
    // console.log('imgUrls', imgUrls);
  },
  // 预览图片
  previewImage:function (e) {
    // console.log(e);
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: this.data.imgUrls // 需要预览的图片http链接列表
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
  paintCanvas: function (params) {
    const ctx = wx.createCanvasContext('myCanvas')
    // 填充
    ctx.setFillStyle('red')
    ctx.setShadow(10, 10, 50, 'green') //设置阴影
    ctx.fillRect(10, 10, 150, 75)
    // 描边（线条）
    // ctx.setStrokeStyle('blue')
    // ctx.setLineWidth(10)
    // ctx.strokeRect(20, 10, 200, 75)

    // ctx.beginPath()
    // ctx.setLineWidth(5)
    // ctx.moveTo(50, 50)
    // ctx.lineTo(200, 50)
    // ctx.stroke()

    /** 
     * 渐变
     * createLinearGradient(x, y, x1, y1) - 创建一个线性的渐变
       createCircularGradient(x, y, r) - 创建一个从圆心开始的渐变
    */
    // const grd = ctx.createLinearGradient(0,0,200,0)
    // grd.addColorStop(0, 'red')  //在渐变中的某一点添加一个颜色变化
    // grd.addColorStop(0.5, 'green')
    // grd.addColorStop(1,'white')
    // ctx.fillRect(10, 10, 150, 75)
    // ctx.setFillStyle(grd)

    // const grd2 = ctx.createCircularGradient(75, 50, 50)
    // grd2.addColorStop(0, 'red')
    // grd2.addColorStop(1,'white')
    // ctx.setFillStyle(grd2)
    // ctx.fillRect(10,10,150,80)

    ctx.draw();//结尾
  }
})
