/*
 * @Author: 杜梦
 * @Date: 2018-07-02 17:44:49
 * @Last Modified by: 杜梦
 * @Last Modified time: 2018-08-31 16:40:13
 */

// 引入所需请求
import {systemConfig,tokenLogin,addrList,addrDetail,cardList,recallList,exchangeList,originalList,availableList,teamList,rechargeList,merchant,agent,orderList,orderDetail,transferList,merchantGoods,collectionList,yuEList,taoBao} from '../services/user';
import { routerRedux } from 'dva/router';
var queryString = require('querystring');
export default {

  //空间对象名称，很重要！
  namespace: 'user',
  //state 对象，大部分数据存储的位置
  state: {
    systemConfig:{},
    user:{},
    addrList:[],
    addrDetail:{},
    cardList:[],
    recallList:[],
    exchangeList:[],
    originalList:[],
    availableList:[],
    teamList:[],
    rechargeList:[],
    orderList:[],
    orderDetail:{},
    transferList:[],
    collectionList:[],
    merchantList:[],
    merchant:{},
    merchantGoods:[],
    agentList:[],
    agent:{},
    yuEList:[],
    data:[],
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
        if(location.pathname!="/login"&&location.pathname!="/reg"&&location.pathname!="/chgpwd"){
          dispatch({
            type: 'userRefresh',
            payload:{
              dispatch
            }
          });

        }



        // 判断所处页面,从而进行请求
        if (location.pathname === '/') {
          // 这里是获取地址栏的参数'parsed'获取后为对象如{id:1}
          location.search=location.search.replace("?","")
          const parsed = queryString.parse(location.search);
          // dispatch({
          //   type: 'getShopList',
          //   payload:{
          //     is_hot:true,
          //     page:1
          //   }
          // });
        }else if(location.pathname === '/myaddr'){
          dispatch({
            type:'getAddrList'
          })
        }else if(location.pathname === '/myaddredit'){
          location.search=location.search.replace("?","")
          const parsed = queryString.parse(location.search);
          if(parsed._id){
            dispatch({
              type:'getAddrDetail',
              payload:{
                _id:parsed._id
              }
            })
          }
        }else if(location.pathname === '/bankcard'){
          dispatch({
            type:'getCardList'
          })
        }else if(location.pathname === '/recharge'){
          location.search=location.search.replace("?","")
          const parsed = queryString.parse(location.search);
          if(parsed.type==='1'){
            dispatch({
              type:'getCardList',
            })
            dispatch({
              type:'getSystemConfig',
            })
          }
        }else if(location.pathname === '/recalllist'){
          dispatch({
            type:'getRecallList'
          })
        }else if(location.pathname === '/exchangelist'){
          dispatch({
            type:'getExchangeList'
          })
        }else if(location.pathname === '/originallist'){
          dispatch({
            type:'getOriginalList'
          })
        }else if(location.pathname === '/availablelist'){
          dispatch({
            type:'getAvailableList'
          })
        }else if(location.pathname === '/team'){
          dispatch({
            type:'getTeamList'
          })
        }else if(location.pathname === '/rechargelist'){
          dispatch({
            type:'getRechargeList'
          })
        }else if(location.pathname === '/merchant'){
          dispatch({
            type:'getMerchant'
          })
        }else if(location.pathname === '/agent'){
          dispatch({
            type:'getAgent'
          })
        }else if(location.pathname === '/myorder'){
          dispatch({
            type: 'getOrderList',
            payload:{
              page:1,
              size:10,
              state:-1
            }
          });
        }else if(location.pathname === '/myorderdetail'){
          location.search=location.search.replace("?","")
          const parsed = queryString.parse(location.search);
          if(parsed._id){
            dispatch({
              type:'getOrderDetail',
              payload:{
                _id:parsed._id
              }
            })
          }
        }else if(location.pathname === '/transferlist'){
          dispatch({
            type:'getTransferList'
          })
        }else if(location.pathname === '/merchantinfo'){
          dispatch({
            type:'getMerchant'
          })
        }else if(location.pathname === '/merchantgoods'){
          dispatch({
            type:'getMerchantGoods'
          })
        }else if(location.pathname === '/collectionlist'){
          dispatch({
            type:'getCollectionList'
          })
        }else if(location.pathname === '/yuelist'){
          dispatch({
            type:'getYuEList'
          })
        }else if(location.pathname === '/record'){
          dispatch({
            type:'record'
          })
        }
        else if(location.pathname === '/recharget'){
          location.search=location.search.replace("?","")
          const parsed = queryString.parse(location.search);
          if(parsed.type==='1'){
            dispatch({
              type:'getCardList',
            })
            dispatch({
              type:'getSystemConfig',
            })
          }
          dispatch({
            type:'getMerchant'
          })
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
    *record({ payload }, {call, put}) {
      const data = yield call(taoBao);
      console.log(data,'rlycs');
      if (data.status) {
        yield put({
          type: 'recordSuccess',
          payload: {data}
        })
      }
    },
    // 获取商家基本信息
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
    // 获取地址列表
    *getAddrList({ payload }, {call, put}) {
      const data = yield call(addrList);
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {addrList: data.resource}
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

    // 获取银行卡列表
    *getCardList({ payload }, {call, put}) {
      const data = yield call(cardList,payload?payload:{});
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {cardList: data.resource}
        })
      }
    },

    // 获取提现列表
    *getRecallList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.user.recallList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {recallList:List}
        })
      }
      if(!payload||!payload.page||!payload.size){
        payload={page:1,size:10};
      }
      const data = yield call(recallList,payload);
      if (data.status) {
        let recallList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            recallList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },

    // 获取转换列表
    *getExchangeList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.user.exchangeList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {exchangeList:List}
        })
      }
      if(!payload||!payload.page||!payload.size){
        payload={page:1,size:10};
      }
      const data = yield call(exchangeList,payload);
      if (data.status) {
        let exchangeList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            exchangeList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },
    // 获取可用积分变动记录
    *getAvailableList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.user.availableList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {availableList:List}
        })
      }
      if(!payload||!payload.page||!payload.size){
        payload={page:1,size:10};
      }
      const data = yield call(availableList,payload);
      if (data.status) {
        let availableList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            availableList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },
    // 获取原始积分变动记录
    *getOriginalList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.user.originalList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {originalList:List}
        })
      }
      if(!payload||!payload.page||!payload.size){
        payload={page:1,size:10};
      }
      const data = yield call(originalList,payload);
      if (data.status) {
        let originalList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            originalList,
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
    *getTeamList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.user.teamList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1||payload.changed){
        List=[];
        yield put({
          type: 'getUser',
          payload: {teamList:List}
        })
      }
      if(!payload){
        payload={page:1,size:10,type:1};
      }
      const data = yield call(teamList,payload);
      if (data.status) {
        let teamList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            teamList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },
    // 获取充值记录
    *getRechargeList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.user.rechargeList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {rechargeList:List}
        })
      }
      if(!payload||!payload.page||!payload.size){
        payload={page:1,size:10};
      }
      const data = yield call(rechargeList,payload);
      if (data.status) {
        let rechargeList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            rechargeList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }
          }
        })
      }
    },
    // 获取商家
    *getMerchant({ payload }, {call, put ,select}) {
      let List = yield select(state => state.user.merchantList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1||payload.changed){
        List=[];
        yield put({
          type: 'getUser',
          payload: {merchantList:List}
        })
      }
      if(!payload||!payload.page||!payload.size||!payload.state){
        payload={page:1,size:10,state:1};
      }
      if(payload.changed){payload.page=1};
      const data = yield call(merchant,payload);
      if (data.status) {
        let merchantList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            merchantList,
            merchant:data.merchant,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },
    // 获取代理
    *getAgent({ payload }, {call, put ,select}) {
      let List = yield select(state => state.user.agentList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {agentList:List}
        })
      }
      if(!payload||!payload.page||!payload.size||!payload.state){
        payload={page:1,size:10,state:1};
      }
      const data = yield call(agent,payload);
      if (data.status) {
        let agentList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            agentList,
            agent:data.agent,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },
    // 获取我的订单列表
    *getOrderList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.user.orderList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1||payload.changed){
        List=[];
        yield put({
          type: 'getUser',
          payload: {orderList:List}
        })
      }
      const data = yield call(orderList,payload);
      if (data.status) {
        let orderList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            orderList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },
    // 获取订单详情
    *getOrderDetail({ payload }, {call, put}) {
      const data = yield call(orderDetail,payload?payload:{});
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {orderDetail: data.resource}
        })
      }
    },
    // 获取线下支付记录列表
    *getTransferList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.user.transferList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {transferList:List}
        })
      }
      if(!payload||!payload.page||!payload.size){
        payload={page:1,size:10};
      }
      const data = yield call(transferList,payload);
      if (data.status) {
        let transferList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            transferList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },
    // 获取店铺商品列表
    *getMerchantGoods({ payload }, {call, put ,select}) {
      let List = yield select(state => state.user.merchantGoods);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {merchantGoods:List}
        })
      }
      if(!payload||!payload.page||!payload.size){
        payload={page:1,size:10};
      }
      const data = yield call(merchantGoods,payload);
      if (data.status) {
        let merchantGoods=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            merchantGoods,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
        })
      }
    },
    // 获取用户收藏列表
    *getCollectionList({ payload }, {call, put}) {
      const data = yield call(collectionList,payload?payload:{});
      if (data.status) {
        yield put({
          type: 'getUser',
          payload: {collectionList: data.resource}
        })
      }
    },

    // 获取余额明细列表
    *getYuEList({ payload }, {call, put ,select}) {
      let List = yield select(state => state.user.yuEList);
      // 如果是首次进入页面或其他原因,原始列表设为空,写法固定
      if(!payload||payload.page===1){
        List=[];
        yield put({
          type: 'getUser',
          payload: {yuEList:List}
        })
      }
      if(!payload||!payload.page||!payload.size){
        payload={page:1,size:10};
      }
      const data = yield call(yuEList,payload);
      console.log(data);
      if (data.status) {
        let yuEList=List.concat(data.resource);
        yield put({
          type: 'updateList',
          payload: {
            yuEList,
            pagination:{
              total:data.sum,
              page:payload.page,
              size:payload.size
            }

          }
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
    recordSuccess(state, action) {
      return { ...state, ...action.payload };
    },
    // 删除地址
    deleteAddr(state, action) {
      const addrList=state.addrList;
      let index=action.payload.index;
      addrList.splice(index,1);
      return { ...state, addrList };
    },
    // 默认地址
    defaultAddr(state, action) {
      const addrList=state.addrList;
      let {isDefault,index,_id}=action.payload;
      addrList.map((i,_index)=>{
        addrList[_index].isDefault=false;
      })
      addrList[index].isDefault=isDefault;
      return { ...state, addrList };
    },


    // 更新列表
    updateList(state,action){
      const {pagination} = action.payload;
      let total= pagination.total;
      let size= pagination.size;
      let page=pagination.page;
      // 判断当前页面是否是最后一页,从而判断是否还有更多,以控制页面是否继续加载,
      console.log("!!!!!!",page, size, total);
      if(page*size<total){
        action.payload.pagination.hasMore=true;
      }else{
        action.payload.pagination.hasMore=false
      }
      return {...state,...action.payload}
    },



  }

};
