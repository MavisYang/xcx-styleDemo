//index.js
//获取应用实例
const app = getApp()
// 引入截图js
import WeCropper from '../../../we-cropper/we-cropper'
let util = require('../../../utils/util.js')
const device = wx.getSystemInfoSync()// 获取设备信息
const width = device.windowWidth;// 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight - 50;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stop: true,
    cropperStatus: false,//是否显示截图组件
    cropperOpt: {
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
    imgUrlList: [
      // {
      //   path:'',
      //   value:''
      // }
    ],
    activeImg: {},//选择的图片
    updateImg: false,//是否是更新图片
    chooseImg:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 裁剪
    const { cropperOpt } = this.data
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
    let _this = this;
    if (_this.data.stop) {
      _this.setData({
        stop: false
      })
      this.wecropper.getCropperImage((src) => {
        if (src) {
          console.log(src, 'src'); //http://tmp/wx138cc46bd172c9de.o6zAJs9zyx85gfzaictAO8nwwJns.FUTfgrxHZVX40409707a88e532bcafb79a66c2fde861.png src
          // 截取图片成功之后处理图片排序
          // 上传图片 接口处理
          // util.downloadImg(src, res => {
          //   // console.log('url', res.url)
          //   console.log(_this.data.activeImg.value,'_this.data.activeImg.value')
          //   let imgObj = {
          //     path: res.url,
          //     id: res.id, //isNaN
          //     value: isNaN(_this.data.activeImg.value) ? 0 : _this.data.activeImg.value + 1
          //   }
          //   console.log(imgObj,'imgObj--')
          //   let imgList=[]
          //   if (_this.data.updateImg) { //更新图片
          //     if (_this.data.imgUrlList.length) { //有图片
          //       console.log(1)
          //       let upData = _this.data.imgUrlList
          //       console.log(_this.data.activeImg.value,'_this.data.activeImg.value')
          //       upData[_this.data.activeImg.value].path = imgObj.path;
          //       upData[_this.data.activeImg.value].id = imgObj.id;
          //       imgObj.value = imgObj.value -1;
          //       imgList = upData;

          //     }else{
          //       console.log(2)
          //       imgList = _this.data.imgUrlList.concat(imgObj);//合并
          //     }
          //   } else {
          //     imgList = _this.data.imgUrlList.concat(imgObj);//合并
          //   }
          //   console.log(imgList, 'imgList')
          //   _this.setData({
          //     imgUrlList: imgList,
          //     activeImg: imgObj,
          //     stop: true,
          //     cropperStatus: false,
          //   })
          // })
        
          // 截图图片处理 不需要调取接口的处理
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1000,
          })

          let imgObj = {
            path: src,
            value: isNaN(_this.data.activeImg.value) ? 0 : _this.data.activeImg.value + 1
          }
          let imgList = []
          console.log(_this.data.imgUrlList.length,'length')
          if (_this.data.updateImg) { //更新图片
            if (_this.data.imgUrlList.length) { //有图片
              console.log(1)
              let upData = _this.data.imgUrlList
              upData[_this.data.activeImg.value].path = imgObj.path;
              upData[_this.data.activeImg.value].id = imgObj.id;
              imgObj.value = imgObj.value - 1;
              imgList = upData;
            } else {
              console.log(2)
              imgList = _this.data.imgUrlList.concat(imgObj);//合并
            }
          } else {
            console.log(3)
            imgList = _this.data.imgUrlList.concat(imgObj);//合并
          }
          console.log(imgList, 'imgList')
          setTimeout(() => {
            _this.setData({
              imgUrlList: imgList,
              activeImg: imgObj,
              stop: true,
              cropperStatus: false,
            })
          }, 1001);

          // wx.previewImage({
          //   current: '', // 当前显示图片的http链接
          //   urls: [src] // 需要预览的图片http链接列表
          // })
        } else {
          _this.setData({
            stop: true
          })
          console.log('获取图片地址失败，请稍后重试')
          util.ErrorTips(_this, '获取图片地址失败，请稍后重试')
        }
      })
    }

  },
  // 截取图片成功之后处理图片排序
  selectImg: function (e) {
    if (e.currentTarget.dataset.type == 1) {
      //添加图片
      this.setData({
        updateImg: false
      })
    } else {
      //点击更换图片
      this.setData({
        updateImg: true
      })
    }
    this.uploadTap()

  },
  // 载入图片 惰性载入
  uploadTap() {
    const self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0];
        self.setData({
          cropperStatus: true
        });
        // 在点击截图按钮时处理排序
        self.wecropper.pushOrign(src)
      }
    })
  },

  // 选中图片
  activeUploadImg(e) {
    let currentImg = e.target.dataset.src;
    console.log(currentImg)
    this.setData({
      activeImg: e.target.dataset.src
    })
  },
  // 删除图片
  deleteUploadImg: function (e) {
    var currentImg = e.currentTarget.dataset.src;
    console.log(currentImg,'currentImg')
    const { imgUrlList, activeImg } = this.data
    console.log(imgUrlList, 'imgUrlList--init')
   
    imgUrlList.splice(currentImg.value,1);
    let selectImgData={}
    console.log(imgUrlList,'imgUrlList--delete')
    if (imgUrlList.length){
      for (let i = 0; i < imgUrlList.length;i++){
        imgUrlList[i].value=i
      }
      selectImgData = imgUrlList[0]
    }
    this.setData({
      imgUrlList: imgUrlList,
      activeImg: selectImgData
    })

    // console.log(e, 'e');
    // const { imgUrlList, activeImg } = this.data
    // var currentImg = e.currentTarget.dataset.src
    // let index = imgUrlList.indexOf(activeImg)
    // imgUrlList.splice(index, 1);//返回删除之后剩下的数据
    // //imgUrlList.splice(currentImg,1);//返回删除的数据
    // this.setData({
    //   imgUrlList: imgUrlList,
    //   activeImg: ''
    // })
    // console.log('imgUrlList', imgUrlList);
  },
  // 预览图片
  previewImage: function (e) {
    // console.log(e);
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: this.data.chooseImg // 需要预览的图片http链接列表
    })
  },

  handleUploadFile:function(e){
    let _this = this;

   wx.chooseImage({
     count: 9, // 默认9 一张时res.tempFilePaths[0] 多张时res.tempFilePaths
     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
     success: function (res) {
       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
       var tempFilePaths = res.tempFilePaths;
       console.log('tempFilePaths', tempFilePaths)
        _this.setData({
          chooseImg: tempFilePaths
        },()=>{
          console.log('chooseImg', _this.data.chooseImg)
        })

      //  上传到服务器
      //  wx.uploadFile({
      //    url: '',
      //    filePath: tempFilePaths[0],
      //    name: 'image',
      //  })
     }
   })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})
