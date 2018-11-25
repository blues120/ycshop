import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/rechargeList.less";
import { Button,Toast} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import InfiniteScroll from 'react-infinite-scroller';
import {timetrans} from '../timetrans';
const queryString = require('querystring');
@connect(state => ({userData: state.user}))
export default class YuEList extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount(){

    }
    //加载更多的方法,写法固定,只需替换变量名
    loadFunc(e){
        const {dispatch,userData}=this.props;
        let page=userData.pagination.page+1;
        dispatch({
          type:'user/getYuEList',
          payload:{
            page,
            size:10
          }
        })
    }

    render() {
        const {history,dispatch,userData}=this.props;
      let yuEList=userData.yuEList;
      // console.log(yuEList,'余额');
      const {type}=this.state;
        // 列表是否有下一页
        let hasMore=userData.pagination.hasMore;

        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'余额记录',
        }


        return (
            <div className={styles.rootBox}>

                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    {/*列表 自动刷新*/}
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={(e)=>this.loadFunc(e)}
                        hasMore={hasMore}
                        threshold={100}
                        loader={<div className="loader" style={{fontSize:".28rem",lineHeight:".36rem",textAlign:"center",marginBottom:".3rem"}} key={0}>加载中...</div>}
                    >
                        <div className={styles.cardList}>
                            { /* 子项 */}
                            {
                                yuEList.map((i,index)=>{
                                    if(i.type===1){
                                        return(
                                            <div key={index} className={styles.cardItem}>
                                                <p><span>变动方式： </span><span>推广收益({i.level}代)</span></p>
                                                <p><span>收益来源：  </span><span>{i.formUser?i.formUser.username:''}</span></p>
                                                <p><span>获取金额：  </span><span>+{i.gold}</span></p>
                                                <p><span>收益时间： </span><span>{timetrans(i.createTime)}</span></p>
                                            </div>
                                        )
                                    }else if(i.type===2){
                                        return(
                                            <div key={index} className={styles.cardItem}>
                                                <p><span>变动方式： </span><span>余额支付购买商品</span></p>
                                                <p style={{display:i.orderNumber?'flex':'none'}}><span>订单编号： </span><span>{i.orderNumber}</span></p>
                                                <p><span>支付金额：  </span><span>-{i.gold}</span></p>
                                                <p><span>支付时间： </span><span>{timetrans(i.createTime)}</span></p>
                                            </div>
                                        )
                                    }else if(i.type===3){
                                      return(
                                        <div key={index} className={styles.cardItem}>
                                          <p><span>变动方式： </span><span>推广收益结算到余额</span></p>
                                          <p  style={{display:i.orderNumber?'flex':'none'}}><span>订单编号： </span><span>{i.orderNumber}</span></p>
                                          <p><span>结算金额：  </span><span>+{i.gold}</span></p>
                                          <p><span>结算时间： </span><span>{timetrans(i.createTime)}</span></p>
                                        </div>
                                      )
                                    }else if(i.type===4){
                                      return(
                                        <div key={index} className={styles.cardItem}>
                                          <p><span>变动方式： </span><span>可用积分兑换成余额</span></p>
                                          <p  style={{display:i.orderNumber?'flex':'none'}}><span>订单编号： </span><span>{i.orderNumber}</span></p>
                                          <p><span>兑换金额：  </span><span>+{i.gold}</span></p>
                                          <p><span>兑换时间： </span><span>{timetrans(i.createTime)}</span></p>
                                        </div>
                                      )
                                    }else if(i.type===5){
                                      return(
                                        <div key={index} className={styles.cardItem}>
                                          <p><span>变动方式： </span><span>淘宝推广收益定期结算到余额</span></p>
                                          <p  style={{display:i.orderNumber?'flex':'none'}}><span>订单编号： </span><span>{i.orderNumber}</span></p>
                                          <p><span>结算金额：  </span><span>+{i.gold}</span></p>
                                          <p><span>结算时间： </span><span>{timetrans(i.createTime)}</span></p>
                                        </div>
                                      )
                                    }else if(i.type===6){
                                      return(
                                        <div key={index} className={styles.cardItem}>
                                          <p><span>变动方式： </span><span>代理每天的收益结算到余额</span></p>
                                          <p  style={{display:i.orderNumber?'flex':'none'}}><span>订单编号： </span><span>{i.orderNumber}</span></p>
                                          <p><span>结算金额：  </span><span>+{i.gold}</span></p>
                                          <p><span>结算时间： </span><span>{timetrans(i.createTime)}</span></p>
                                        </div>
                                      )
                                    }else if(i.type===7){
                                      return(
                                        <div key={index} className={styles.cardItem}>
                                          <p><span>变动方式： </span><span>用户充值余额</span></p>
                                          <p  style={{display:i.orderNumber?'flex':'none'}}><span>订单编号： </span><span>{i.orderNumber}</span></p>
                                          <p><span>充值金额：  </span><span>+{i.gold}</span></p>
                                          <p><span>充值时间： </span><span>{timetrans(i.createTime)}</span></p>
                                        </div>
                                      )
                                    }

                                })
                            }


                        </div>
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}
