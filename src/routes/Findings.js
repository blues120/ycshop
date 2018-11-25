import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/findings.less";
import {Button, Toast} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import good01 from '../assets/images/good01.png';
import InfiniteScroll from "react-infinite-scroller";
import DetailItem from './DetailItem';
@connect(state => ({shopData: state.shop}))
export default class Findings extends Component {

  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      selectedTabBar: "findings"
    };
  }

  // async componentDidMount() {
  //     // const data=await
  // }
  loadFunc(e){
    const {dispatch,shopData}=this.props;
    let page=shopData.pagination.page+1;
    dispatch({
      type:'shop/findings',
      payload:{
        page,
        size:10
      }
    })
  }
  render() {
    const {history, dispatch,shopData} = this.props;
    let findsData=shopData.findsData;
    let hasMore=shopData.pagination.hasMore;
    // 传入navbBar参数
    const navBarProps = {
      leftVisible: true,
      leftFunc() {
        dispatch(routerRedux.goBack())
      },
      titleName: "积分商城",
    };
    // 传入tabBar参数
    const tabBarProps = {
      selectedTabBar: this.state.selectedTabBar,
      history
    }

    const goodListProps = {
      goodData: findsData,
      tapItem(item){
        dispatch(routerRedux.push("/jifendetail?_id="+item._id))
      }
    };

    return (
      <div className={styles.rootBox}>

        {/*头部导航栏*/}
        <MyNavBar {...navBarProps}/>
        {/*底部标签栏*/}
        <MyTabBar {...tabBarProps}/>

        <div className={styles.main}>
          {/* 商品列表 */}
          <InfiniteScroll
            pageStart={0}
            loadMore={(e)=>this.loadFunc(e)}
            hasMore={hasMore}
            threshold={100}
            loader={<div className="loader" style={{fontSize:".28rem",lineHeight:".36rem",textAlign:"center",marginBottom:".3rem"}} key={0}>加载中...</div>}
          >
            <DetailItem {...goodListProps} />
          </InfiniteScroll>

        </div>
      </div>
    )
  }
}
