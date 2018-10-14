import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/agent.less";
import { Button,Toast} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import InfiniteScroll from 'react-infinite-scroller';
import {timetrans} from '../timetrans';
@connect(state => ({userData: state.user}))
export default class Agent extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    //加载更多的方法,写法固定,只需替换变量名
    loadFunc(e){
        const {dispatch,userData}=this.props;
        let page=userData.pagination.page+1;
        dispatch({
          type:"user/getAgent",
          payload:{
            page,
            size:10,
            state:1
          }
        })
    }
    render() {
        const {history,dispatch,userData}=this.props;
        let hasMore=userData.pagination.hasMore;
        let agent=userData.agent;
        let agentList=userData.agentList;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'我的代理',
        }
       
        
        return (
            <div className={styles.rootBox}>
                
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    {/*头部收益信息*/}
                    <div className={styles.topInfo}>
                        <span className={styles.title}>区域奖励     </span>
                        <div className={styles.info}>
                            <div className={styles.circle}>
                                <div className={styles.content}>
                                    <span>{agent.area_gold}</span>
                                    <span>区域奖励</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*列表 自动刷新*/}
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={(e)=>this.loadFunc(e)}
                        hasMore={hasMore}
                        threshold={100}
                        loader={<div className="loader" style={{fontSize:".28rem",lineHeight:".36rem",textAlign:"center",marginBottom:".3rem"}} key={0}>加载中...</div>}
                    >
                        <div className={styles.list}>
                            <span className={styles.title}>奖励明细</span>
                            {/* 列表 */}
                            <div className={styles.content}>
                                {/* item */}
                                {
                                    agentList.map((i,index)=>{
                                        return(
                                            <div key={index} className={styles.cardItem}>
                                                <p><span>编号： </span><span>{i.orderId}</span></p>
                                                <p><span>金额：  </span><span>{i.gold}</span></p>
                                                <p><span>时间： </span><span>{timetrans(i.createTime)}</span></p>
                                            </div>
                                        )
                                    })
                                }
                                
                            </div>
                        </div>
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}
