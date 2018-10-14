import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/merchantGoods.less";
import { Button,Toast} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import person from '../assets/icon/person.jpg';
import InfiniteScroll from 'react-infinite-scroller';
@connect(state => ({userData: state.user}))
export default class MerchantGoods extends Component {

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
          type:"user/getMerchantGoods",
          payload:{
            page
          }
        })
    }

    render() {
        const {history,dispatch,userData}=this.props;
        let merchantGoods=userData.merchantGoods;
        // 列表是否有下一页
        let hasMore=userData.pagination.hasMore;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'店铺商品',
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
                        <div className={styles.List}>
                            {/* 商品子项 */}
                            {
                                merchantGoods.map((i,index)=>{
                                    return(
                                        <div key={index} className={styles.goodItem} onClick={()=>history.push('/gooddetail?_id='+i._id)} >
                                            <div className={styles.itemLeft}>
                                                <img src={APIHost+i.cover} alt=""/>
                                            </div>
                                            <div className={styles.itemRight}>
                                                <p className={styles.name}>{i.name}</p>
                                                <p className={styles.prop}>{i.introduction}</p>
                                                <p className={styles.price}>属性：{i.specifications.map((item,_index)=>{
                                                    return item.goodsPropertyCategoryName+'；';
                                                })}</p>
                                                <p className={styles.num}>库存：{i.stock}</p>
                                            </div>
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
