/*
 * @Author: 杜梦
 * @Date: 2018-07-02 17:42:44
 * @Last Modified by: 杜梦
 * @Last Modified time: 2018-08-31 16:36:34
 */

//  本页请求



import * as fetchs from '../utils/fetch';



// 用户系统配置
export function systemConfig(){
  return fetchs.read_Token(fetchs.APIHost+'/systemSet/list',fetchs.getAuth('/systemSet/list')).then(response => response.json())
  .then(json => { return json});
}
/*积分详情*/
export function jifenDetail(params){
  return fetchs.read_Token(fetchs.APIHost+'/integral/admin/goods/'+params._id).then(response => response.json())
    .then(json => { return json});
}
/*积分商城列表*/
export function jinFenLists(params){
  if(!params.page){
    params.page=1;
  }
  if(!params.size){
    params.size=5;
  }
  return fetchs.read_Token(fetchs.APIHost+'/integral/goods/list/'+params.page+'/'+params.size,fetchs.getAuth('/integral/goods/list/'+params.page+'/'+params.size)).then(response => response.json())
    .then(json => { return json});
}

// 上传图片
export function uploadImg(params){
  return fetchs.uploadImg_Token(fetchs.APIHost+'/filebase64',params).then(response => response.json())
  .then(json => { return json});
}





// 用户获取个人信息
export function tokenLogin(){
  return fetchs.read_Token(fetchs.APIHost+'/user/info',fetchs.getAuth('/user/info')).then(response => response.json())
  .then(json => { return json});
}
// 更改个人信息
export function userEdit(params){
  return fetchs.creat_Token(fetchs.APIHost+'/user/update/info',fetchs.getAuth('/user/update/info'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}



// 申请成为商家
export function applyMer(params){
  let _id=params._id;
  delete params._id;
  return fetchs.creat_Token(fetchs.APIHost+'/merchant/apply/info/'+_id,fetchs.getAuth('/merchant/apply/info/'+_id),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}
// 申请成为商家
export function applyAgent(params){
  let _id=params._id;
  delete params._id;
  return fetchs.creat_Token(fetchs.APIHost+'/agent/apply/info/'+_id,fetchs.getAuth('/agent/apply/info/'+_id),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}


// 获取地址列表
export function addrList(){
  return fetchs.read_Token(fetchs.APIHost+'/user/address/list',fetchs.getAuth('/user/address/list')).then(response => response.json())
  .then(json => { return json});
}

// 添加地址
export function addAddr(params){
  return fetchs.creat_Token(fetchs.APIHost+'/user/add/new/address',fetchs.getAuth('/user/add/new/address'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}


// 删除地址
export function deteteAddr(params){
  let _id=params._id;
  delete params._id;
  return fetchs.delete_Token(fetchs.APIHost+'/user/delete/old/address/'+_id,fetchs.getAuth('/user/delete/old/address/'+_id),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}


// 编辑
export function editAddr(params){
  let _id=params._id;
  delete params._id;
  return fetchs.update_Token(fetchs.APIHost+'/user/edit/new/address/'+_id,fetchs.getAuth('/user/edit/new/address/'+_id),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}

// 编辑
export function defaultAddr(params){
  let _id=params._id;
  delete params._id;
  return fetchs.update_Token(fetchs.APIHost+'/user/edit/default/address/'+_id,fetchs.getAuth('/user/edit/default/address/'+_id),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}



// 获取地址信息
export function addrDetail(params){
  let _id=params._id;
  delete params._id;
  return fetchs.read_Token(fetchs.APIHost+'/user/address/info/'+_id,fetchs.getAuth('/user/address/info/'+_id)).then(response => response.json())
  .then(json => { return json});
}


// 添加银行卡
export function addCard(params){
  return fetchs.creat_Token(fetchs.APIHost+'/user/add/new/card',fetchs.getAuth('/user/add/new/card'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}

// 获取地址列表
export function cardList(){
  return fetchs.read_Token(fetchs.APIHost+'/user/card/list',fetchs.getAuth('/user/card/list')).then(response => response.json())
  .then(json => { return json});
}



// 提现
export function recall(params){
  return fetchs.creat_Token(fetchs.APIHost+'/user/apply/put/forward',fetchs.getAuth('/user/apply/put/forward'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}

// 提现列表
export function recallList(params){
  return fetchs.read_Token(fetchs.APIHost+'/user/apply/put/forward/list/'+params.page+'/'+params.size,fetchs.getAuth('/user/apply/put/forward/list/'+params.page+'/'+params.size)).then(response => response.json())
  .then(json => { return json});
}

// 积分转余额
export function exchange(params){
  return fetchs.creat_Token(fetchs.APIHost+'/exchange/to/balance',fetchs.getAuth('/exchange/to/balance'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}

// 积分转余额列表
export function exchangeList(params){
  return fetchs.read_Token(fetchs.APIHost+'/exchange/kyjf/list/'+params.page+'/'+params.size,fetchs.getAuth('/exchange/kyjf/list/'+params.page+'/'+params.size)).then(response => response.json())
  .then(json => { return json});
}

// 可用积分变动列表
export function availableList(params){
  return fetchs.read_Token(fetchs.APIHost+'/exchange/kyjf/all/list/'+params.page+'/'+params.size,fetchs.getAuth('/exchange/kyjf/all/list/'+params.page+'/'+params.size)).then(response => response.json())
  .then(json => { return json});
}

// 原始积分变动列表
export function originalList(params){
  return fetchs.read_Token(fetchs.APIHost+'/exchange/ysjf/all/list/'+params.page+'/'+params.size,fetchs.getAuth('/exchange/ysjf/all/list/'+params.page+'/'+params.size)).then(response => response.json())
  .then(json => { return json});
}

// 团队列表
export function teamList(params){
  if(params.type===1){
    return fetchs.read_Token(fetchs.APIHost+'/generation/one/'+params.page+'/'+params.size,fetchs.getAuth('/generation/one/'+params.page+'/'+params.size)).then(response => response.json())
    .then(json => { return json});
  }else if(params.type===2){
    return fetchs.read_Token(fetchs.APIHost+'/generation/two/'+params.page+'/'+params.size,fetchs.getAuth('/generation/two/'+params.page+'/'+params.size)).then(response => response.json())
    .then(json => { return json});
  }else{
    return fetchs.read_Token(fetchs.APIHost+'/generation/three/'+params.page+'/'+params.size,fetchs.getAuth('/generation/three/'+params.page+'/'+params.size)).then(response => response.json())
    .then(json => { return json});
  }

}


// 充值
export function rechange(params){
  return fetchs.creat_Token(fetchs.APIHost+'/chongzhi/alipay/payment',fetchs.getAuth('/chongzhi/alipay/payment'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}


// 原始积分变动列表
export function rechargeList(params){
  return fetchs.read_Token(fetchs.APIHost+'/order/list/chongzhi/'+params.page+'/'+params.size,fetchs.getAuth('/order/list/chongzhi/'+params.page+'/'+params.size)).then(response => response.json())
  .then(json => { return json});
}


// 获取商家收益和货款
export function merchant(params){
  return fetchs.read_Token(fetchs.APIHost+'/record/huokuan/list/'+params.state+'/'+params.page+'/'+params.size,fetchs.getAuth('/record/huokuan/list/'+params.state+'/'+params.page+'/'+params.size)).then(response => response.json())
  .then(json => { return json});
}


// 获取代理收益和奖励
export function agent(params){
  return fetchs.read_Token(fetchs.APIHost+'/record/agent/list/'+params.state+'/'+params.page+'/'+params.size,fetchs.getAuth('/record/agent/list/'+params.state+'/'+params.page+'/'+params.size)).then(response => response.json())
  .then(json => { return json});
}



// 用户订单列表
export function orderList(params){
  return fetchs.read_Token(fetchs.APIHost+'/order/list/user/state/'+params.state+'/'+params.page+'/'+params.size,fetchs.getAuth('/order/list/user/state/'+params.state+'/'+params.page+'/'+params.size)).then(response => response.json())
    .then(json => { return json});
}
/*公告获取*/
export function gonggaoGet(params){
  return fetchs.read_Token(fetchs.APIHost+'/systemSmg/list/'+params.page+'/'+params.size,fetchs.getAuth('/systemSmg/list/'+params.page+'/'+params.size)).then(response => response.json())
    .then(json => { return json});
}
/*公告ID*/
export function gonggaoGetID(params){
  return fetchs.read_Token(fetchs.APIHost+'/systemSmg/'+params.id,fetchs.getAuth('/systemSmg/'+params.id)).then(response => response.json())
    .then(json => { return json});
}
/*推广收益明细*/
export function TuiSY(params){
  return fetchs.read_Token(fetchs.APIHost+'/record/extensiongold/list/'+params.page+'/'+params.size,fetchs.getAuth('/record/extensiongold/list/'+params.page+'/'+params.size)).then(response => response.json())
    .then(json => { return json});
}
// 完成订单
export function updateOrder(params){
  let _id=params._id;
  delete params._id;
  return fetchs.update_Token(fetchs.APIHost+'/order/user/update/'+_id,fetchs.getAuth('/order/user/update/'+_id),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}


// 获取某个订单信息
export function orderDetail(params){
  let _id=params._id;
  return fetchs.read_Token(fetchs.APIHost+'/order/'+_id,fetchs.getAuth('/order/'+_id)).then(response => response.json())
  .then(json => { return json});
}



// 线下支付宝支付
export function outlineAlipay(params){
  return fetchs.creat_Token(fetchs.APIHost+'/outline/alipay/payment',fetchs.getAuth('/outline/alipay/payment'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}
/*余额支付*/
export function outlineYueE(params){
  return fetchs.creat_Token(fetchs.APIHost+'/outline/yue/payment',fetchs.getAuth('/outline/yue/payment'),JSON.stringify(params)).then(response => response.json())
    .then(json => { return json});
}
// 线下支付记录
export function transferList(params){
  return fetchs.read_Token(fetchs.APIHost+'/record/outline/list/'+params.page+'/'+params.size,fetchs.getAuth('/record/outline/list/'+params.page+'/'+params.size)).then(response => response.json())
  .then(json => { return json});
}


// 获取本人的商户信息(如果是的话)(使用商家收益页面的接口)
// export function merchantInfo(params){
//   let _id=params._id;
//   return fetchs.read_Token(fetchs.APIHost+'/merchant/admin/info',fetchs.getAuth('/merchant/admin/info')).then(response => response.json())
//   .then(json => { return json});
// }

// 更新商户信息
export function updateMerchant(params){
  let _id=params._id;
  delete params._id;
  return fetchs.update_Token(fetchs.APIHost+'/merchant/info/'+_id,fetchs.getAuth('/merchant/info/'+_id),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}

// 商家商品列表
export function merchantGoods(params){
  return fetchs.read_Token(fetchs.APIHost+'/merchat/goods/list/'+params.page+'/'+params.size,fetchs.getAuth('/merchat/goods/list/'+params.page+'/'+params.size)).then(response => response.json())
  .then(json => { return json});
}



// 用户收藏列表
export function collectionList(params){
  return fetchs.read_Token(fetchs.APIHost+'/user/collection/user/list/'+1,fetchs.getAuth('/user/collection/user/list/'+1)).then(response => response.json())
  .then(json => { return json});
}
export function collectionListT(params){
  return fetchs.read_Token(fetchs.APIHost+'/user/collection/user/list/'+2,fetchs.getAuth('/user/collection/user/list/'+2)).then(response => response.json())
    .then(json => { return json});
}



// 用户余额记录
export function yuEList(params){
  return fetchs.read_Token(fetchs.APIHost+'/exchange/yue/all/list/'+params.page+'/'+params.size,fetchs.getAuth('/exchange/yue/all/list/'+params.page+'/'+params.size)).then(response => response.json())
  .then(json => { return json});
}
/*taobao*/



export function jieSuan(params){
  return fetchs.creat_Token(fetchs.APIHost+'/merchat/apply/wait/money',fetchs.getAuth('/merchat/apply/wait/money'),JSON.stringify(params)).then(response => response.json())
    .then(json => { return json});
}
export function znx(params){
  return fetchs.creat_Token(fetchs.APIHost+'/user/add/mail',fetchs.getAuth('/user/add/mail'),JSON.stringify(params)).then(response => response.json())
    .then(json => { return json});
}
export function getznx(params){
  return fetchs.read_Token(fetchs.APIHost+'/user/mail/list/'+params.page+'/'+params.size,fetchs.getAuth('/user/mail/list/'+params.page+'/'+params.size)).then(response => response.json())
    .then(json => { return json});
}

/*淘宝*/
export function taoBao(params){
  let {topcate,subcate,keyword}=params;
  if(!params.subcate&&params.topcate){
    return fetchs.creat_Token(fetchs.APIHost+'/taobao/product/list/'+params.page+'/'+params.size,fetchs.getAuth('/taobao/product/list/'+params.page+'/'+params.size),JSON.stringify({topcate})).then(response => response.json())
      .then(json => { return json});
  }else if(params.keyword){
    return fetchs.create(fetchs.APIHost+'/taobao/product/search/'+params.page+'/'+params.size,JSON.stringify({keyword})).then(response => response.json())
      .then(json => { return json});
  }else{
    return fetchs.creat_Token(fetchs.APIHost+'/taobao/product/list/'+params.page+'/'+params.size,fetchs.getAuth('/taobao/product/list/'+params.page+'/'+params.size),JSON.stringify({topcate,subcate})).then(response => response.json())
      .then(json => {return json});
  }

}
/*ID*/
export function taoBID(params){
  return fetchs.creat_Token(fetchs.APIHost+'/taobao/product/link',fetchs.getAuth('/taobao/product/link'),JSON.stringify(params)).then(response => response.json())
    .then(json => { return json});
}
/*淘宝搜索*/
export function TBS(params){
  let {keyword}=params;
  return fetchs.create(fetchs.APIHost+'/taobao/product/search/'+params.page+'/'+params.size,JSON.stringify({keyword})).then(response => response.json())
    .then(json => { return json});
}









