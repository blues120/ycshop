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
export default class AvailableList extends Component {

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
          type:"user/getAvailableList",
          payload:{
            page,
            size:10
          }
        })
    }
    
    render() {
        const {history,dispatch,userData}=this.props;

        let availableList=userData.availableList;
        // 列表是否有下一页
        let hasMore=userData.pagination.hasMore;
        
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'可用积分记录',
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
                                availableList.map((i,index)=>{
                                    return(
                                        <div key={index} className={styles.cardItem}>
                                            <p><span>变动方式： </span><span>{i.type===1?'兑换余额':i.type===2?'积分返还':'购买商品'}</span></p>
                                            {i.type===1?<p><span>转换金额： </span><span>{i.number}</span></p>:''}
                                            <p><span>{i.type===1?'实际到账':i.type===2?'返还金额':'花费金额'}： </span><span className={styles.active}>{i.gold}</span></p>
                                            
                                            <p><span>转换时间： </span><span>{timetrans(i.createTime)}</span></p>
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
