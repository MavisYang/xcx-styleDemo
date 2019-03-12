import Dial from "./utils/dial.js"

Page({
  data: {
    mode: 1
  },

  onLoad () {
    let self = this
    this.dial = new Dial(this, {
      areaNumber: 8,
      speed: 16,
      awardNumer: 1,
      mode: 1,
      callback: () => {
        wx.showModal({
          title: '提示',
          content: '恭喜您，中奖了',
          showCancel: false,
          success: (res) => {
            self.dial.reset()
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })        
      }
    })

  },

  onReady () {
    console.log("onReady")    
  },

  onSwitchMode (event) {
    let mode = event.currentTarget.dataset.mode
    this.setData({mode})
    this.dial.switch(mode)
  }  

})