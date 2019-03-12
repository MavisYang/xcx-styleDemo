
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
    SECRET: "bGl6LXlvdWxpLXd4OnNlY3JldA==", //base64加密liz-youli-wx:secret
    APP_ID: 'wx138cc46bd172c9de', //APPID wx655b79f74ee85585
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

    list: [
        {
            "instanceItemId": "a0d9d824-fe1a-4bd7-a37e-dd85c111a37f",
            "commercialItemId": "328c4546-fdeb-4a0e-afc3-1a5687fe14cf",
            "productId": "36ec628d-a196-4893-97c6-a599865eeb52",
            "skuId": "5dea866e-8b44-42b4-a644-ee16e31ff6c0",
            "skuCode": "fR0AajD5",
            "skuName": "美妆美妆",
            "skuPic": "http://test.gemii.cc:58080/lizcloud/fs/noauth/media/5af2f736509b7a003ceedf03",
            "storeHouseId": "50c8abcc-e846-4f6c-a4a9-0465a4fd2f47",
            "storeHouse": "欧盟",
            "settlementTypeValue": "结算价:80.0",
            "quantity": 2,
            "priceId": "5dea866e-8b44-42b4-a644-ee16e31ff6c0",
            "costPrice": "90.0",
            "retailPrice": "90.0",
            "basicPrice": "80.0",
            "expressPrice": "2.0",
            "paymentAmount": "180.0",
            "status": 1,
            "refundStatus": 0,
            "attrs": [
                {
                    "code": "GOODS_RULE_a087026a-d66f-4d8c-9d98-81a00b3c70b6",
                    "name": "规格",
                    "value": "默认规格",
                    "displayValue": "默认规格"
                }
            ]
        },
        {
            "instanceItemId": "05303a0e-6526-42ea-9e17-16b7954eddb4",
            "commercialItemId": "c7c45944-9c03-4388-95a1-c12a8986db8c",
            "productId": "90bc0237-e693-4955-85ea-efe95d015f69",
            "skuId": "301407a8-c6d0-42e5-8dbb-1d120d003750",
            "skuCode": "bqFkXURm",
            "skuName": "不好的",
            "skuPic": "http://test.gemii.cc:58080/lizcloud/fs/noauth/media/5ad46e74509b7a0031fabeb0",
            "storeHouseId": "86535c61-e1f9-4ba2-af73-ae031f0636e9",
            "settlementTypeValue": "结算价:80.0",
            "quantity": 5,
            "priceId": "301407a8-c6d0-42e5-8dbb-1d120d003750",
            "costPrice": "90.0",
            "retailPrice": "90.0",
            "basicPrice": "80.0",
            "paymentAmount": "450.0",
            "status": 2,
            "refundStatus": 2,
            "attrs": [
                {
                    "code": "GOODS_RULE_a087026a-d66f-4d8c-9d98-81a00b3c70b6",
                    "name": "规格",
                    "value": "默认规格",
                    "displayValue": "默认规格"
                }
            ]
        },
        {
            "instanceItemId": "c59e1825-6580-46c8-93e6-1241371a0f34",
            "commercialItemId": "d2d5771e-30ba-47f6-b68e-3983c7f7f492",
            "productId": "987392f3-437e-4961-905e-083051005ef2",
            "skuId": "1c31a6fa-c03f-4405-83b8-12a77be0d8d3",
            "skuCode": "EiIhmhEv",
            "skuName": "好商品",
            "skuPic": "http://test.gemii.cc:58080/lizcloud/fs/noauth/media/5aefebc3509b7a002911ab5c",
            "storeHouseId": "e1ce47de-0dab-4b69-b7bb-0982d72551af",
            "settlementTypeValue": "结算价:80.0",
            "quantity": 10,
            "priceId": "1c31a6fa-c03f-4405-83b8-12a77be0d8d3",
            "costPrice": "90.0",
            "retailPrice": "90.0",
            "basicPrice": "80.0",
            "paymentAmount": "900.0",
            "status": 3,
            "refundStatus": 0,
            "attrs": [
                {
                    "code": "GOODS_RULE_5cdecfc1-f621-4f3b-8e28-0539dd9b3711",
                    "name": "尺码",
                    "value": "110",
                    "displayValue": "110"
                }
            ]
        },
        {
            "instanceItemId": "af21c968-2477-44a7-8d91-b33e7821f9fd",
            "commercialItemId": "d4904951-aca4-43f4-9e9f-92145874f3ea",
            "productId": "b7381a5f-a84b-4c00-b156-36931b60d140",
            "skuId": "b800585e-ece4-4048-9013-1f376a5c63ca",
            "skuCode": "1804130020",
            "skuName": "Qing",
            "skuPic": "http://test.gemii.cc:58080/lizcloud/fs/noauth/media/5ad0769f509b7a002911ab13",
            "storeHouseId": "6447c8b1-b54a-4d00-bf8b-59b08bd5e2ca",
            "settlementTypeValue": "结算价:80.0",
            "quantity": 3,
            "priceId": "b800585e-ece4-4048-9013-1f376a5c63ca",
            "costPrice": "90.0",
            "retailPrice": "90.0",
            "basicPrice": "80.0",
            "paymentAmount": "270.0",
            "status": 4,
            "refundStatus": 0,
            "attrs": [
                {
                    "code": "GOODS_RULE_a087026a-d66f-4d8c-9d98-81a00b3c70b6",
                    "name": "规格",
                    "value": "默认规格",
                    "displayValue": "默认规格"
                }
            ]
        },
        {
            "instanceItemId": "c808a4e4-2ed7-41e2-9dd0-a87bb919820d",
            "commercialItemId": "ca185a1f-350b-40bd-bd2f-868187f75a15",
            "productId": "e58c0e06-f04a-42f4-b793-73909168b8dd",
            "skuId": "465e11e4-4a65-4f34-b937-5fc1a188a01f",
            "skuCode": "WCkxw3NC",
            "skuName": "玩具",
            "skuPic": "http://test.gemii.cc:58080/lizcloud/fs/noauth/media/5ae14bbd509b7a003ceedee9",
            "storeHouseId": "fac33490-4eeb-4de1-9c3e-5b21e924e60c",
            "settlementTypeValue": "结算价:80.0",
            "quantity": 3,
            "priceId": "465e11e4-4a65-4f34-b937-5fc1a188a01f",
            "costPrice": "90.0",
            "retailPrice": "90.0",
            "basicPrice": "80.0",
            "paymentAmount": "270.0",
            "status": 3,
            "refundStatus": 0,
            "attrs": [
                {
                    "code": "GOODS_RULE_a087026a-d66f-4d8c-9d98-81a00b3c70b6",
                    "name": "规格",
                    "value": "默认规格",
                    "displayValue": "默认规格"
                }
            ]
        }
    ]
}

module.exports = api;