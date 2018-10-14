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
export default class RechargeList extends Component {

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
          type:"user/getRechargeList",
          payload:{
            page,
            size:10
          }
        })
    }
    
    render() {
        const {history,dispatch,userData}=this.props;
        let rechargeList=userData.rechargeList;
        const {type}=this.state;
        // 列表是否有下一页
        let hasMore=userData.pagination.hasMore;
        
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'充值记录',
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
                                rechargeList.map((i,index)=>{
                                    return(
                                        <div key={index} className={styles.cardItem}>
                                            <p><span>订单编号： </span><span>{i.orderNumber}</span></p>
                                            <p><span>充值金额：  </span><span>{i.total_payment}</span></p>
                                            <p><span>充值状态：  </span><span>充值成功</span></p>
                                            <p><span>充值时间： </span><span>{timetrans(i.createTime)}</span></p>
                                        </div>
                                    )
                                })
                            }
                            
                            
                        </div>
                    
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}
