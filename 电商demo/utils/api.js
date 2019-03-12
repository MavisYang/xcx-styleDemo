
// const ORIGIN_NAME = 'https://cloud.gemii.cc/lizcloud/api' //生产环境
// const ORIGIN_NAMEs = 'https://cloud.gemii.cc' //生产环境
const ORIGIN_NAME = 'http://dev.gemii.cc:58080/lizcloud/api' //开发模式
const ORIGIN_NAMEs = 'http://dev.gemii.cc:58080' //开发模式
const GOODS_NAME = '/e-goods-api/noauth/platform/' //商品
// const GOODS_NAME = '/e-goods-api/noauth' //商品
const USER_LOGIN = ORIGIN_NAME + '/basis-api/noauth/' //授权绑定，用户登录1
const TOKRN = ORIGIN_NAME + '/uaa/oauth/token?' //获取token


// http://dev.gemii.cc:580805bf81fd0-fc4f-40b3-ad11-93d42d487a25&type=0

const api = {
    SECRET: "Basic bGl6LXlvdWxpLXd4OnNlY3JldA==", //base64加密liz-youli-wx:secret
    APP_ID: 'wx655b79f74ee85585', //APPID
    authLogin: USER_LOGIN + 'wdwd/loadUserAuthorizeWechat', //获取unionID
    postUserInfo: USER_LOGIN + 'wdwd/loadUserAuthorizeWechat', //提交用户标识
    getToken: TOKRN + 'grant_type=password&password=&username=', //获取token
    refreshToken: TOKRN + 'grant_type=refresh_token&refresh_token=', //刷新token
    uploadImg: ORIGIN_NAME + '/gridfs-api/noauth/media',//上传图片
    goodDet: ORIGIN_NAME + '/e-goods-api/noauth/tenant/good/brief?goodId=',//商品详情
    goodsDetail: ORIGIN_NAME + '/e-goods-api/noauth/tenant/good/', //商品sku

    goodsDiscription: ORIGIN_NAMEs + '/assistServer/goods/fetchRichText?type=1&goodId=',//商品详情描述

    getAdrId: ORIGIN_NAME + '/e-fulfillment-sys/authsec/address/get', //获取地址id
    addAdr: ORIGIN_NAME + '/tenantadmin-api/authsec/useraddr/assemble',//添加地址
    getAdrList: ORIGIN_NAME + '/tenantadmin-api/authsec/useraddr/advance/assemble',//获取地址列表
    getAdrDetail: ORIGIN_NAME + '/tenantadmin-api/authsec/useraddr/',//地址详情
    deleteAdr: ORIGIN_NAME + '/tenantadmin-api/authsec/useraddr/',//删除地址
    getCityOr: ORIGIN_NAME + '/basis-api/authsec/region',//获取城市联动

    getOrderList: ORIGIN_NAME + '/e-order-api/authsec/orderapi/buyer/goods/orders?_currentPage=0&_pageSize=',//获取orderList
    orderDetail: ORIGIN_NAME + '/e-order-api/authsec/orderapi/order/app/detail?',//订单详情

    confirmOrder: ORIGIN_NAME + '/e-purchase-api/authsec/goods/submit/confirm?sourceType=2',//提交确认购买
    buyOrder: ORIGIN_NAME + '/e-purchase-api/authsec/goods/submit/buy',//提交购买订单
    payOrder: ORIGIN_NAME + '/e-purchase-api/authsec/goods/payment/batch',//订单支付
    affirmOrder: ORIGIN_NAME + '/e-purchase-api/authsec/goods/order/confirm?orderId=',//确认收货
    affirmRefundOrder: ORIGIN_NAME + '/e-purchase-api/authsec/workflow/task/finish',//确认收货
    getOrderStatusNum: ORIGIN_NAME + '/e-order-api/authsec/orderapi/order/stats',//订单不同状态订单数统计接口
    cancelOrder: ORIGIN_NAME + '/e-purchase-api/authsec/goods/order/cancle',//取消订单
    leaveMessage: ORIGIN_NAME + '/e-purchase-api/authsec/goods/leave/message',//买家留言

    getLogisticsD: ORIGIN_NAME + '/e-order-api/authsec/fulfillment/purchaseorder/',//获取物流详情
    getLogisticsM: ORIGIN_NAME + '/e-fulfillment-sys/noauth/fulfillment/ticket/order/',//根据快递单ID查询物流信息

    WChactPay: ORIGIN_NAME + '/e-purchase-api/authsec/payment/prePayment',//微信支付
    // checkPayNotify: ORIGIN_NAME + '/e-purchase-api/noauth/payment/checkPayNotify/',//检测微信支付是否成功

    refundList: ORIGIN_NAME + '/e-purchase-api/authsec/refund/buyer/list',//退款列表
    refundeDetail: ORIGIN_NAME + '/e-purchase-api/authsec/refund/',//退款订单详情
    createExpress: ORIGIN_NAME + '/e-purchase-api/authsec/refund/createExpress',//创建退货快递单
    couriers: ORIGIN_NAME + '/e-order-api/noauth/couriers?currentPage=0',//快递公司
    loadAmountUpperLimit: ORIGIN_NAME + '/e-purchase-api/authsec/refund/loadAmountUpperLimit',//退款上限
    refundExpress: ORIGIN_NAME + '/e-purchase-api/authsec/refund/order/',//退款物流
    loadRefundReasons: ORIGIN_NAME + '/e-purchase-api/authsec/refundreason/loadRefundReasons?_status=1&_type=',//退款原因
    refundSubmit: ORIGIN_NAME + '/e-purchase-api/authsec/refund',//申请退款
    refundCancle: ORIGIN_NAME + '/e-purchase-api/authsec/workflow/task/finish',//撤销退款

    tenantGoodSuggesst: ORIGIN_NAME + '/e-goods-api/noauth/tenant/goods/title/suggesst?tenantId=',//今日推荐
    tenantGoodList: ORIGIN_NAME + '/e-goods-api/noauth/tenant/goods/title/list?tenantId=',//租户商品列表
    tenantStore: ORIGIN_NAME + '/tenantadmin-api/noauth/tenantapi/tenant/store?_tenantId=',//租户信息

    changeSOL:ORIGIN_NAME+'/e-goods-api/noauth/support/shortTolong?shortId=',//短id转长id

}

module.exports = api;