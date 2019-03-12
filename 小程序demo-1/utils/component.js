


/**
 * 跳整页面 wx.navigateTo跳整不成功
 * 排查：index 和 logs 用于wx.navigateTo跳整成功，但是wx.switchTab跳转失败
 * 其他页面order、home等用于wx.navigateTo跳整不成功，但是wx.switchTab跳转成功
 * wx.navigateTo/wx.redirectTo只能用在非tabBar页面的跳转，要跳转到tabBar页面，需要使用wx.switchTab({})
 * 解决：将 wx.navigateTo({}) 替换为 wx.switchTab({})
 */
function navigateTo(url) {
  wx.navigateTo({
    url: url
  })
}

function switchTab(url) {
  wx.switchTab({
    url: url,
  })
}

module.exports = {
  navigateTo: navigateTo,
  switchTab: switchTab
}
