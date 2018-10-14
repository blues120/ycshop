import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/test.less";
import { Button,Toast} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import InfiniteScroll from 'react-infinite-scroller';
@connect(state => ({shopData: state.shop}))
export default class Test extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    //加载更多的方法,写法固定,只需替换变量名
    loadFunc(e){
        // const {dispatch,shopData}=this.props;
        // let page=shopData.pagination.page+1;
        // dispatch({
        //   type:"shop/getShopList",
        //   payload:{
        //     is_hot:true,
        //     page
        //   }
        // })
    }
    
    render() {
        const {history,dispatch,shopData}=this.props;
        // 列表是否有下一页
        let hasMore=shopData.pagination.hasMore;
        
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:"这是一个标题",
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
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}
