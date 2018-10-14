/*
 * @Author: 杜梦
 * @Date: 2018-07-02 17:44:49
 * @Last Modified by: 杜梦
 * @Last Modified time: 2018-08-31 16:27:40
 */

// 引入所需请求
import {tokenLogin,systemConfig,addrDetail,getznx} from '../services/user';
import {carouselList,classifyList,newsList,hotGoodsList,goodList,goodDetail,cartList,temporaryOrder,defaultAddr,orderInfo,reviewList,checkCollection,shopInfo,shopList,classify} from '../services/shop';

import { routerRedux } from 'dva/router';
var queryString = require('querystring');
function handleCategory(list,id){
  //父类别
  var result = [];
  for(let i=0;i<list.length;i++){
      if(!id||list[i].parentId==id){
          let parent = list[i];
          var children =handleCategory(list,parent._id);
          children.length == 0? "": (parent.children=children);
          if(!id&&!parent.parentId){
              parent.key = parent._id;
              parent.value = parent._id;
              parent.label = parent.name;
              result.push(parent);
          }else if(id&&parent.parentId){
              parent.key = parent._id
              parent.value = parent._id;
              parent.label = parent.name;
              result.push(parent);
          }
      }
  }
  return result;
}
export default {

  //空间对象名称，很重要！
  namespace: 'shop',
  //state 对象，大部分数据存储的位置
  state: {
    systemConfig:{},
    user:{},
    carouselList:[],
    classifyList:[],
    newsList:[],
    hotGoodsList:[],
    goodList:[],
    goodDetail:{},
    checkCollection:false,
    reviewList:[],
    cartList:[],
    temporaryOrder:[],
    addrDetail:{},
    orderInfo:{},

    shopInfo:{},
    shopList:[],

    classify:[],
    pagination:{
      page:1,
      total:0,
      hasMore:false
    }
  },

  //加载组件前执行的请求
  subscriptions: {
    setup ({ dispatch, history }) {

      history.listen(location => {
        dispatch({
          type:'getUser',
          payload:{
            pagination:{
              page:1,
              total:0,
              hasMore:false
            }
          }
        })
        // 检测是否登录，
        if(location.pathname!='/login'&&location.pathname!='/reg'&&location.pathname!='/chgpwd'){
          dispatch({
            type: 'userRefresh',
            payload:{
              dispatch
            }
          });

        }
        if (location.pathname === '/') {
          // 调用下面的方法,写法固定.type为方法名,payload为参数
          dispatch({
            type: 'getCarouselList'
          });
          dispatch({
            type: 'getClassifyList'
          });
          dispatch({
            type: 'getNewsList'
          });
          dispatch({
            type: 'getHotGoodsList',
            page:1,
            size:10
          });

        }else if(location.pathname === '/goodlist'){
          location.search=location.search.replace("?","")
          const parsed = queryString.parse(location.search);
          if(parsed.keyword){
            dispatch({
              type: 'getGoodList',
              payload:{
                keyword:parsed.keyword,
                page:1,
                size:10
              }
            });
          }else if(parsed._id){
            dispatch({
              type: 'getGoodList',
              payload:{
                _id:parsed._id,
                page:1,
                size:10
              }
            });
          }

        }
        /*1*/
        else if(location.pathname === '/messagedetail'){

            dispatch({
              type: 'getMessageList',
              payload:{
                page:1,
                size:10
              }
            });

        }
        else if(location.pathname === '/gooddetail'){
          location.search=location.search.replace("?","")
          const parsed = queryString.parse(location.search);
          dispatch({
            type: 'getSystemConfig'
          });
          if(parsed._id){
            dispatch({
              type: 'getGoodDetail',
              payload:{
                _id:parsed._id,
              }
            });
            dispatch({
              type: 'getReviewList',
              payload:{
                goodsId:parsed._id,
                page:1,
                size:10
              }
            });
            dispatch({
              type: 'getCheckCollection',
              payload:{
                _id:parsed._id,
              }
            });


          }

        }else if(location.pathname === '/cart'){
          dispatch({
            type: 'getCartList'
          });
        }else if(location.pathname === '/confirmorder'){
          location.search=location.search.replace("?","")
          const parsed = queryString.parse(location.search);
          dispatch({
            type: 'getTemporaryOrder'
          });
          if(parsed.addrid){
            dispatch({
              type: 'getAddrDetail',
              payload:{
                _id:parsed.addrid,
              }
            });
          }else{
            dispatch({
              type: 'getDefaultAddr'
            });
          }
        }else if(location.pathname === '/payorder'){
          location.search=location.search.replace("?","")
          const parsed = queryString.parse(location.search);
          dispatch({
            type: 'getOrderInfo',
            payload:{
              _id:parsed._id
            }
          });
          dispatch({
            type: 'getSystemConfig'
          });
          dispatch({
            type: 'userRefresh'
          });
        }else if(location.pathname === '/review'){
          location.search=location.search.replace("?","")
          const parsed = queryString.parse(location.search);
          if(parsed.goodId){
            dispatch({
              type: 'getGoodDetail',
              payload:{
                _id:parsed.goodId,
              }
            });
          }
          if(parsed.orderId){
            dispatch({
              type: 'getOrderInfo',
              payload:{
                _id:parsed.orderId,
              }
            });
          }


        }else if(location.pathname === '/reviewlist'){
          location.search=location.search.replace("?","")
          const parsed = queryString.parse(location.search);
          if(parsed._id){
            dispatch({
              type: 'getReviewList',
              payload:{
                goodsId:parsed._id,
                page:1,
                size:10
              }
            });
          }
        }else if(location.pathname === '/shop'){
          location.search=location.search.replace("?","")
          const parsed = queryString.parse(location.search);
          if(parsed._id){
            dispatch({
              type: 'getShopInfo',
              payload:{
                _id:parsed._id,
              }
            });
            dispatch({
              type: 'getShopList',
              payload:{
                _id:parsed._id,
                page:1,
                size:10
              }
            });

          }
        }else if(location.pathname === '/classify'){
          dispatch({
            type: 'getClassify'
          });

        }




      })
    }
  },

  //远程请求信息
  effects: {
    // 获取系统配置
    *getSystemConfig({ payload }, {call, put}) {
      const data = yield call(systemConfig);
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {systemConfig: data.resource[0].appSet}
        })
      }
    },
    // 获取基本信息
    *userRefresh({ payload }, {call, put}) {
      const data = yield call(tokenLogin);
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {user: data.resource}
        })
      }
      else{
        payload.dispatch(routerRedux.push({pathname: '/login'}));
      }
    },
    // 获取轮播列表
    *getCarouselList({ payload }, {call, put}) {
      const data = yield call(carouselList);
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {carouselList: data.resource}
        })
      }
    },
    // 获取分类列表
    *getClassifyList({ payload }, {call, put}) {
      const data = yield call(classifyList);
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {classifyList: data.resource}
        })
      }
    },
    // 获取活动公告列表
    *getNewsList({ payload }, {call, put}) {
      const data = yield call(newsList);
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {newsList: data.resource}
        })
      }
    },
    // 获取团队列表记录
    *getHotGoodsList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.shop.hotGoodsList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {hotGoodsList:List}
        })
      }
      if(!payload){
        payload={page:1,size:10};
      }
      const data = yield call(hotGoodsList,payload);
      if (data.status) {
        let hotGoodsList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            hotGoodsList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },
    // 获取团队列表记录
    *getGoodList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.shop.goodList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {goodList:List}
        })
      }
      const data = yield call(goodList,payload);
      if (data.status) {
        let goodList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            goodList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },
    *getMessageList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.shop.goodList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {goodList:List}
        })
      }
      const data = yield call(getznx,payload);
      if (data.status) {
        let goodList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            goodList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },
    // 获取商品详情
    *getGoodDetail({ payload }, {call, put}) {
      const data = yield call(goodDetail,payload);
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {goodDetail: data.resource}
        })
      }
    },
    // 获取用户当前商品的收藏状态
    *getCheckCollection({ payload }, {call, put}) {
      const data = yield call(checkCollection,payload);
      yield put({
        type: 'getUser',
        payload: {checkCollection: data.status}
      })
    },

    // 获取购物车列表
    *getCartList({ payload }, {call, put}) {
      const data = yield call(cartList,payload);
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {cartList: data.resource}
        })
      }
    },
    // 获取临时订单
    *getTemporaryOrder({ payload }, {call, put}) {
      const data = yield call(temporaryOrder,payload);
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {temporaryOrder: data.resource}
        })
      }
    },
    // 获取默认地址
    *getDefaultAddr({ payload }, {call, put}) {
      const data = yield call(defaultAddr,payload?payload:{});
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {addrDetail: data.resource}
        })
      }
    },
    // 获取地址详情
    *getAddrDetail({ payload }, {call, put}) {
      const data = yield call(addrDetail,payload?payload:{});
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {addrDetail: data.resource}
        })
      }
    },
    // 获取订单详情
    *getOrderInfo({ payload }, {call, put}) {
      const data = yield call(orderInfo,payload?payload:{});
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {orderInfo: data.resource}
        })
      }
    },
    // 获取商品评论列表
    *getReviewList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.shop.reviewList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {
            reviewList:List,
              pagination:{
            }}
        })
      }
      const data = yield call(reviewList,payload);
      if (data.status) {
        let reviewList=List.concat(data.resource);

        yield put({
          type: 'updateList',
          payload: {
            reviewList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },
    // 获取某个商家的信息
    *getShopInfo({ payload }, {call, put}) {
      const data = yield call(shopInfo,payload?payload:{});
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {shopInfo: data.resource}
        })
      }
    },

    // 获取某个商家所有的商品
    *getShopList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.shop.shopList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {
            shopList:List,
              pagination:{
            }}
        })
      }
      const data = yield call(shopList,payload);
      if (data.status) {
        let shopList=List.concat(data.resource);

        yield put({
          type: 'updateList',
          payload: {
            shopList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },

    // 获取商品所有分类
    *getClassify({ payload }, {call, put}) {
      const data = yield call(classify,payload?payload:{});
      if (data.status) {
        let newData=handleCategory(data.resource);
        yield put({
          type: 'getUser',
          payload: {classify: newData}
        })
      }
    },














  },

  //reducer 改变数据的唯一途径
  reducers: {
    // 基本使用
    getUser(state, action) {
      return { ...state, ...action.payload };
    },

    // 更新列表
    updateList(state,action){
      const {pagination} = action.payload;
      let total= pagination.total;
      let size= pagination.size;
      let page=pagination.page;
      // 判断当前页面是否是最后一页,从而判断是否还有更多,以控制页面是否继续加载,
      if(page*size<total){
        action.payload.pagination.hasMore=true;
      }else{
        action.payload.pagination.hasMore=false
      }
      return {...state,...action.payload}
    },

    // 删除购物侧
    deleteCart(state, action) {
      let {cartList}=state;
      let index=action.payload.index;
      cartList.splice(index,1);

      return { ...state, cartList };
    },


  }

};
