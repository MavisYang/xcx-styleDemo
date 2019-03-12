 const wxRequest = require('./wxRequest')
const wxApi = require('./wxApi')
const API = require('./api')
const Promise = require('./es6-promise');

function onLogin() {
    let url = API.getToken + 'unionid_' + wx.getStorageSync('unionid') + '_type_2';
    console.log(url,'url---');
    
    let token = 'bGl6LXlvdWxpLXd4OnNlY3JldA=='
    return wxRequest.fetch(url, { type: 'Basic', value: token }, '', "POST").then((res) => {
    // return wxRequest.fetch(url, { type: 'Basic', value: null }, '', "POST").then((res) => {
        saveTokens(res.data.access_token, res.data.refresh_token, res.data.expires_in);
        return res.data.access_token
    }).catch((req) => {
        return 'error'
    })
}
function setWait() {
    wx.removeStorageSync('access_token');
}
function saveTokens(access_token, refresh_token, expires_in) {
    wx.setStorageSync('access_token', access_token);
    wx.setStorageSync('refresh_token', refresh_token);
    var exp = new Date();
    var expires_ins = exp.getTime() + expires_in * 1000 - 30000;
    wx.setStorageSync('expires_in', expires_ins);
}
function onRefreshToken() {
    setWait();
    let token = 'bGl6LXlvdWxpLXd4OnNlY3JldA=='
    var url = API.refreshToken + wx.getStorageSync('refresh_token');
    return wxRequest.fetch(url, { type: 'Basic', value: token }, '', 'POST').then((res) => {
    // return wxRequest.fetch(url, { type: 'Basic', value: null }, '', 'POST').then((res) => {
        if (res.data.access_token) {
            saveTokens(res.data.access_token, res.data.refresh_token, res.data.expires_in);
            return res.data.access_token;
        } else {
            return onLogin().then(res => {
                return res
            });
        }
    }).catch(req => {
        if (wx.getStorageSync('refresh_token') != null) {
            return onLogin().then(res => {
                return res
            });
        }
    })
}
function getAccessToken() {
    var date = new Date();
    var dt = date.getTime();
    var expires_in = wx.getStorageSync('expires_in');
    if(!wx.getStorageSync('access_token') || !wx.getStorageSync('expires_in') || !wx.getStorageSync('refresh_token')){
        return onLogin().then(res => {
            return res
        });
    }else {
        if ((!expires_in || dt >= expires_in) && wx.getStorageSync('access_token')) {
            return onRefreshToken();
        } else if (!wx.getStorageSync('access_token')) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(wx.getStorageSync('access_token'))
                }, 2000)
            })
        } else {
            return new Promise((resolve, reject) => {
                resolve(wx.getStorageSync('access_token'))
            })
        }
    }
}
module.exports = {
    onLogin: onLogin,
    getAccessToken: getAccessToken
}