/*
 * @Author: 杜梦
 * @Date: 2018-07-03 10:46:10
 * @Last Modified by: 杜梦
 * @Last Modified time: 2018-08-31 15:46:02
 */

import * as fetchs from '../utils/fetch';



// 获取轮播图列表
export function carouselList(){
  return fetchs.read_Token(fetchs.APIHost+'/mobile/view/slider',fetchs.getAuth('/mobile/view/slider')).then(response => response.json())
  .then(json => { return json});
}

export function xiaoLB(){
  return fetchs.read_Token(fetchs.APIHost+'/mobile/view/promotion/slider',fetchs.getAuth('/mobile/view/promotion/slider')).then(response => response.json())
    .then(json => { return json});
}
// 获取商品分类列表
export function classifyList(){
  return fetchs.read_Token(fetchs.APIHost+'/goods/category/four/list/10',fetchs.getAuth('/goods/category/four/list/10')).then(response => response.json())
  .then(json => { return json});
}

// 获取活动公告列表
export function newsList(){
  return fetchs.read_Token(fetchs.APIHost+'/news/new/1/5',fetchs.getAuth('/news/new/1/5')).then(response => response.json())
  .then(json => { return json});
}

// 获取热门商品列表
export function hotGoodsList(params){
  return fetchs.read_Token(fetchs.APIHost+'/goods/hot/'+params.page+'/'+params.size,fetchs.getAuth('/goods/hot/'+params.page+'/'+params.size)).then(response => response.json())
  .then(json => { return json});
}

// 搜索商品
export function goodList(params){
  if(params._id){
    return fetchs.read_Token(fetchs.APIHost+'/goods/list/'+params._id+'/'+params.page+'/'+params.size,fetchs.getAuth('/goods/list/'+params._id+'/'+params.page+'/'+params.size)).then(response => response.json())
    .then(json => { return json});
  }else if(params.keyword){
    let sql={keyword:params.keyword}
    return fetchs.creat_Token(fetchs.APIHost+'/goods/search/'+params.page+'/'+params.size,fetchs.getAuth('/goods/search/'+params.page+'/'+params.size),JSON.stringify(sql)).then(response => response.json())
    .then(json => { return json});
  }
}

// 获取商品详情
export function goodDetail(params){
  return fetchs.read_Token(fetchs.APIHost+'/goods/'+params._id,fetchs.getAuth('/goods/'+params._id)).then(response => response.json())
  .then(json => { return json});
}



// 商品加入购物车
export function addCart(params){
  return fetchs.creat_Token(fetchs.APIHost+'/shoppingCart',fetchs.getAuth('/shoppingCart'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}


// 获取商品详情
export function cartList(params){
  return fetchs.read_Token(fetchs.APIHost+'/shoppingCart/list',fetchs.getAuth('/shoppingCart/list')).then(response => response.json())
  .then(json => { return json});
}

// 删除购物车数据
export function deleteCart(params){
  return fetchs.creat_Token(fetchs.APIHost+'/shoppingCart/item',fetchs.getAuth('/shoppingCart/item'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}

// 删除购物车数据
export function updateCart(params){
  let _id=params._id;
  delete params._id;
  return fetchs.update_Token(fetchs.APIHost+'/shoppingCart/update/'+_id,fetchs.getAuth('/shoppingCart/update/'+_id),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}




// 暂存订单
export function saveOrder(params){
  return fetchs.creat_Token(fetchs.APIHost+'/order/temporary/store/goods',fetchs.getAuth('/order/temporary/store/goods'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}


// 获取暂存订单
export function temporaryOrder(params){
  return fetchs.read_Token(fetchs.APIHost+'/order/temporary/store/info',fetchs.getAuth('/order/temporary/store/info')).then(response => response.json())
  .then(json => { return json});
}
// 获取用户默认地址
export function defaultAddr(params){
  return fetchs.read_Token(fetchs.APIHost+'/user/address/default',fetchs.getAuth('/user/address/default')).then(response => response.json())
  .then(json => { return json});
}



// 下单
export function addOrder(params){
  return fetchs.creat_Token(fetchs.APIHost+'/order',fetchs.getAuth('/order'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}

// 获取用户默认地址
export function orderInfo(params){
  return fetchs.read_Token(fetchs.APIHost+'/order/'+params._id,fetchs.getAuth('/order/'+params._id)).then(response => response.json())
  .then(json => { return json});
}

// 支付宝支付
export function getAlipay(params){
  return fetchs.creat_Token(fetchs.APIHost+'/alipay/payment',fetchs.getAuth('/alipay/payment'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}


// 余额支付
export function yuEPay(params){
  return fetchs.creat_Token(fetchs.APIHost+'/yue/payment/config',fetchs.getAuth('/yue/payment/config'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}


// 评论商品
export function addReview(params){
  let _id=params.goodId;
  delete params.goodId;
  return fetchs.creat_Token(fetchs.APIHost+'/goods/add/comment/'+_id,fetchs.getAuth('/goods/add/comment/'+_id),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}


// 评论商品
export function reviewList(params){
  let sql={goodsId:params.goodsId};
  return fetchs.creat_Token(fetchs.APIHost+'/goods/get/comment/list/'+params.page+'/'+params.size,fetchs.getAuth('/goods/get/comment/list/'+params.page+'/'+params.size),JSON.stringify(sql)).then(response => response.json())
    .then(json => { return json});
}


// 获取用户是否收藏当前商品
export function checkCollection(params){
  return fetchs.read_Token(fetchs.APIHost+'/user/collection/item/'+params._id,fetchs.getAuth('/user/collection/item/'+params._id)).then(response => response.json())
  .then(json => { return json});
}


// 更改收藏状态
export function collection(params){
  return fetchs.creat_Token(fetchs.APIHost+'/user/collection',fetchs.getAuth('/user/collection'),JSON.stringify(params)).then(response => response.json())
  .then(json => { return json});
}



// 获取某商户的信息
export function shopInfo(params){
  return fetchs.read_Token(fetchs.APIHost+'/merchant/user/info/'+params._id,fetchs.getAuth('/merchant/user/info/'+params._id)).then(response => response.json())
  .then(json => { return json});
}

// 获取某个商家所有的商品
export function shopList(params){
  let sql={merchantId:params._id}
  return fetchs.creat_Token(fetchs.APIHost+'/merchat/goods/list/'+params.page+'/'+params.size,fetchs.getAuth('/merchat/goods/list/'+params.page+'/'+params.size),JSON.stringify(sql)).then(response => response.json())
  .then(json => { return json});
}


// 获取所有商品分类的信息
export function classify(params){
  return fetchs.read_Token(fetchs.APIHost+'/goods/category/list',fetchs.getAuth('/goods/category/list')).then(response => response.json())
  .then(json => { return json});
}

export function paihangFunc(params){
  return fetchs.read_Token(fetchs.APIHost+'/user/rank/info',fetchs.getAuth('/user/rank/info')).then(response => response.json())
    .then(json => { return json});
}
export function delPl(params){
  return fetchs.creat_Token(fetchs.APIHost+'/goods/del/comment/'+params,fetchs.getAuth('/goods/del/comment/'+params),JSON.stringify({})).then(response => response.json())
    .then(json => { return json});
}

//修改
export function xiuGai(params){
  return fetchs.read_Token(fetchs.APIHost+'/goods/get/comment/'+params,fetchs.getAuth('/goods/get/comment/'+params)).then(response => response.json())
    .then(json => { return json});
}
export function XIUGAI(params){
  let _id=params.id;
  delete params.id;
  return fetchs.update_Token(fetchs.APIHost+'/goods/edit/comment/'+_id,fetchs.getAuth('/goods/edit/comment/'+_id),JSON.stringify(params)).then(response => response.json())
    .then(json => { return json});
}
export function getDp(params){
  return fetchs.read_Token(fetchs.APIHost+'/user/collection/shop/'+params,fetchs.getAuth('/user/collection/shop/'+params)).then(response => response.json())
    .then(json => { return json});
}
export function postSp(params){
  return fetchs.creat_Token(fetchs.APIHost+'/user/shop/collection',fetchs.getAuth('/user/shop/collection'),JSON.stringify(params)).then(response => response.json())
    .then(json => { return json});
}
export function postMS(params){
  return fetchs.create(fetchs.APIHost+'/mobile/view/eckill/'+1+'/'+8,JSON.stringify({where:{}})).then(response => response.json())
    .then(json => { return json});
}
export function miaoSFunc(params){
  return fetchs.read(fetchs.APIHost+'/goods/'+params).then(response => response.json())
    .then(json => { return json});
}

