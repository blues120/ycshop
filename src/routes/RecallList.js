import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/recallList.less";
import { Button,Toast} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import InfiniteScroll from 'react-infinite-scroller';
import {timetrans} from '../timetrans';
const queryString = require('querystring');
@connect(state => ({userData: state.user}))
export default class RecallList extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            type:1
        };
    }

    componentWillMount(){
        
    }
    //加载更多的方法,写法固定,只需替换变量名
    loadFunc(e){
        const {dispatch,userData}=this.props;
        let page=userData.pagination.page+1;
        dispatch({
          type:"user/getRecallList",
          payload:{
            page,
            size:10
          }
        })
    }
    
    render() {
        const {history,dispatch,userData}=this.props;
        // 列表是否有下一页
        let hasMore=userData.pagination.hasMore;
        let recallList=userData.recallList;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'提现记录',
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
                                recallList.map((i,index)=>{
                                    let time=timetrans(i.createTime)
                                    return(
                                        <div key={index} className={styles.cardItem}>
                                            <p><span>提现账户： </span><span>尾号{i.bankCard.slice(-4)}</span></p>
                                            <p><span>提现金额： </span><span>{i.money}</span></p>
                                            <p><span className={styles.em}>手续费： </span><span>{i.shouxufei}</span></p>
                                            <p><span>实际到账： </span><span className={styles.active}>{(Number(i.gold)-i.shouxufei).toFixed(2)}</span></p>
                                            <p><span>提现时间： </span><span>{time}</span></p>
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
