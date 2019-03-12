const API = require('./api.js')
let wxRequest = require('./wxRequest.js')
let AuthProvider = require('./AuthProvider.js')

/**
 * 
 * @param {*}  退款列表
 * @param {*} callback 
 */
function refundList(callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(API.refundList, { type: 'bearer', value: token }, null, "GET")
    }).then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({ "err": 'Error this fetch' + req })
    })
}
/**
 * 
 * @param {*} data 退款订单详情
 * @param {*} callback 
 */
function refundDetail(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        let url = `${API.refundeDetail}${data}/wx/detail/buyer`
        return wxRequest.fetch(url, { type: 'bearer', value: token }, null, "GET")
    }).then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({ "err": 'Error this fetch' + req })
    })
}
/**
 * 
 * @param {*} data 创建退货快递单
 * @param {*} callback 
 */
function createExpress(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(API.createExpress, { type: 'bearer', value: token }, data, "POST")
    }).then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({ "err": 'Error this fetch' + req })
    })
}
/**
 * 
 * @param {*} url 快递公司
 * @param {*} callback 
 */
function couriers(name, num, callback) {
    let url;
    if (name) {
        url = API.couriers + '&name=' + name + '&pageSize=10'
    }
    if (!name && num) {
        url = API.couriers + '&pageSize=' + num
    }
    wxRequest.fetch(url, null, null, "GET").then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({ "err": 'Error this fetch' + req })
    })
}


/**
 * 
 * @param {*} data 退款金额上限
 * @param {*} callback 
 */
function loadAmountUpperLimit(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(API.loadAmountUpperLimit, { type: 'bearer', value: token }, data, "POST")
    }).then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({ "err": 'Error this fetch' + req })
    })
}

/**
 * 
 * @param {*} data 退款物流
 * @param {*} callback 
 */
function refundExpress(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        let url = `${API.refundExpress}${data.refundTicket}/express?_sourceType=${data.sourceType}`;
        return wxRequest.fetch(url, { type: 'bearer', value: token }, null, "GET")
    }).then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({ "err": 'Error this fetch' + req })
    })
}

/**
 * 
 * @param {*} data 退款原因列表
 * @param {*} callback 
 */
function loadRefundReasons(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(API.loadRefundReasons + data, { type: 'bearer', value: token }, null, "GET")
    }).then(res => {
        if (res.data.resultCode == 100) {
            callback(res.data.resultContent)
        }
    }).catch(req => {
        console.log({ "err": 'Error this fetch' + req })
    })
}
/**
 * 
 * @param {*} data 提交申请退款
 * @param {*} callback 
 */
function refundSubmit(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxRequest.fetch(API.refundSubmit, { type: 'bearer', value: token }, data, "POST")
    }).then(res => {
        callback(res.data)
    }).catch(req => {
        console.log({ "err": 'Error this fetch' + req })
    })
}


function refundCancle(data, callback) {
    AuthProvider.getAccessToken().then(token => {
        let url = `${API.refundCancle}?processInsId=${data.processInsId}&taskId=${data.taskId}&isNeedReceive=true`;
        return wxRequest.fetch(url, { type: 'bearer', value: token }, data.body, "POST")
    }).then(res => {
        callback(res.data)
    }).catch(req => {
        console.log({ "err": 'Error this fetch' + req })
    })
}
/**
 * 重构数据
 * @param {*} taskList 
 * @param {*} resultContent 
 * @param {*} callback 
 */
function createData(taskList, resultContent, callback) {
    let data = [];
    for (let i = 0; i < taskList.length; i++) {
        //等待商家审核
        if (taskList[i].taskDefinitionKey == 'USER_UI_010811102' || taskList[i].taskDefinitionKey == 'USER_UI_010811202' || taskList[i].taskDefinitionKey == 'USER_UI_010811302') {
            taskList[i].content = '商家正在受理你的申请，请耐心等待'
            data.unshift(taskList[i]);
        }
        //商家同意退款
        if (taskList[i].taskDefinitionKey == 'USER_UI_010811103' || taskList[i].taskDefinitionKey == 'USER_UI_010811203' || taskList[i].taskDefinitionKey == 'USER_UI_010811307') {
            taskList[i].content = '商家同意退款'
            data.unshift(taskList[i]);
        }
        //商家直接退款
        if (taskList[i].taskDefinitionKey == 'USER_UI_010811303') {
            taskList[i].content = '商家直接退款'
            data.unshift(taskList[i]);
        }
        //买家已撤销
        if (taskList[i].taskDefinitionKey == 'USER_UI_010811204' || taskList[i].taskDefinitionKey == 'USER_UI_010811304' || taskList[i].taskDefinitionKey == 'USER_UI_010811105') {
            taskList[i].content = '买家已撤销'
            data.unshift(taskList[i]);
        }
        //商家已拒绝
        if (taskList[i].taskDefinitionKey == 'USER_UI_010811104' || taskList[i].taskDefinitionKey == 'USER_UI_010811309' || taskList[i].taskDefinitionKey == 'USER_UI_010811207') {
            //少图片
            taskList[i].content = resultContent.refuseDetail.refuseDesc
            data.unshift(taskList[i]);
        }
        //商家拒绝退款
        if (taskList[i].taskDefinitionKey == 'USER_UI_010811308') {
            taskList[i].content = '商家拒绝退款'
            data.unshift(taskList[i]);
        }
        //等待买家签收
        if (taskList[i].taskDefinitionKey == 'USER_UI_010811205') {
            if (resultContent.supplierExpressInfo) {
                let str = '';
                for (let i = 0; i < resultContent.supplierExpressInfo.length; i++) {
                    str += resultContent.supplierExpressInfo[i].expressCourierName + ' ' + resultContent.supplierExpressInfo[i].expressNo + ' '
                }
                taskList[i].content = str;
            }
            data.unshift(taskList[i]);
        }
        //买家已经签收
        if (taskList[i].taskDefinitionKey == 'USER_UI_010811206') {
            taskList[i].content = '买家已经签收'
            data.unshift(taskList[i]);
        }
        //等待买家发货
        if (taskList[i].taskDefinitionKey == 'USER_UI_010811305') {
            //可以填写单号
            taskList[i].content = resultContent.refundReceiveAddr ? (resultContent.refundReceiveAddr.recieverName + ' ' + resultContent.refundReceiveAddr.recieverPhone + ' ' + resultContent.refundReceiveAddr.recieverAddr) : ''
            data.unshift(taskList[i]);
        }
        //等待商家签收
        if (taskList[i].taskDefinitionKey == 'USER_UI_010811306') {
            if (resultContent.expressInfo) {
                taskList[i].content = resultContent.expressInfo[0].expressCourierName + ' ' + resultContent.expressInfo[0].expressNo
            }
            data.unshift(taskList[i]);
        }
        //退款成功
        if (taskList[i].taskDefinitionKey == 'success_refund_amount') {
            taskList[i].content = '退款到账'
            data.unshift(taskList[i]);
        }
        //返回得到数据
        callback(data)
    }
}



module.exports = {
    refundList: refundList,//退款列表
    refundDetail: refundDetail,//退款订单详情
    createExpress: createExpress,//创建退货快递单
    couriers: couriers,//快递公司
    loadAmountUpperLimit: loadAmountUpperLimit,//退款金额上限
    refundExpress: refundExpress,//退款物流
    loadRefundReasons: loadRefundReasons,//退款原因列表
    refundSubmit: refundSubmit,//提交申请退款
    createData: createData,//构造taskList数据
    refundCancle: refundCancle,//撤销退款
}