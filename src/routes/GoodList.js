import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/goodlist.less";
import { Button,Toast} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import GoodItem from '../components/GooodItem';
import InfiniteScroll from 'react-infinite-scroller';
let queryString = require('querystring');
@connect(state => ({shopData: state.shop}))
export default class GoodList extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            type:0
        };
    }

    componentWillMount() {
        const {dispatch,location}=this.props;
        location.search=location.search.replace("?","");
        const parsed = queryString.parse(location.search);
        if(parsed.keyword){
            this.setState({
                type:1,
                key:parsed.keyword
            })
        }else if(parsed._id){
            this.setState({
                type:2,
                key:parsed._id
            })
        }


    }

    //加载更多的方法,写法固定,只需替换变量名
    loadFunc(e){
        if(e===0){return}
        const {dispatch,shopData}=this.props;
        let {type,key}=this.state;
        let page=shopData.pagination.page+1;
        if(type===1){
            dispatch({
              type:"shop/getGoodList",
              payload:{
                keyword:key,
                page,
                size:10
              }
            })
        }else if(type===2){
            dispatch({
                type:"shop/getGoodList",
                payload:{
                  _id:key,
                  page,
                  size:10
                }
              })
        }
    }

    render() {
        const {history,dispatch,shopData}=this.props;
      // 列表是否有下一页
        let hasMore=shopData.pagination.hasMore;

        // 伪造的列表数据
        let goodList=shopData.goodList;
      // 商品列表的参数
        const goodListProps = {
            goodData: goodList,
            tapItem(item){
                dispatch(routerRedux.push("/gooddetail?_id="+item._id))
            }
        }
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'商品列表',
        }

        return (
            <div className={styles.rootBox}>

                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>

                    {/*商品列表 自动刷新*/}
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={(e)=>this.loadFunc(e)}
                        hasMore={hasMore}
                        threshold={100}
                        loader={<div className="loader" style={{fontSize:".28rem",lineHeight:".36rem",textAlign:"center",marginBottom:".3rem"}} key={0}>加载中...</div>}
                    >
                        <GoodItem {...goodListProps} />
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}
