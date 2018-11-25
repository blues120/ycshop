import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/originalList.less";
import { Button,Toast} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import InfiniteScroll from 'react-infinite-scroller';
import {timetrans} from '../timetrans';
@connect(state => ({userData: state.user}))
export default class OriginalList extends Component {

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
          type:"user/getOriginalList",
          payload:{
            page,
            size:10
          }
        })
    }

    render() {
        const {history,dispatch,userData}=this.props;
        let originalList=userData.originalList;
      // 列表是否有下一页
        let hasMore=userData.pagination.hasMore;

        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'原始积分记录',
        };


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
                                originalList.map((i,index)=>{
                                    return(
                                        <div key={index} className={styles.cardItem}>
                                            <p><span>{i.type===3||i.type===8?'扣除':'获得'}积分： </span><span>{parseFloat(i.gold).toFixed(2)}</span></p>
                                            <p><span>{i.type===3||i.type===8?'扣除':'获得'}方式： </span><span>{i.type===1?'购物返还':i.type===2?'每日释放':i.type===3?'购物支付':i.type===4?'线下支付':(i.type===5?'线下分销获得':i.type===6?'淘宝返积分':i.type===7?'线下购物代理获得':'兑换积分商品')}</span></p>
                                            <p><span>{i.type===3||i.type===8?'扣除':'获得'}时间： </span><span>{timetrans(i.createTime)}</span></p>
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
