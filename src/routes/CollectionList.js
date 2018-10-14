import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/collectionList.less";
import {Button, Toast} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import InfiniteScroll from 'react-infinite-scroller';

@connect(state => ({userData: state.user}))
export default class CollectionList extends Component {

  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      state: 1,
      data: []
    };
  }


  //加载更多的方法,写法固定,只需替换变量名
  loadFunc(e) {
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

  chgState(state) {
    this.setState({state}, () => {
      this.loadFunc(0, true);
    })
  }

  async componentDidMount() {
    const data = await fetch.collectionListT();
    this.setState({data:data.resource});
    console.log(data, 'cwt');
  }

  render() {
    const {history, dispatch, userData} = this.props;
    let collectionList = userData.collectionList;
    // 列表是否有下一页
    let hasMore = userData.pagination.hasMore;
    const {state} = this.state;
    console.log(this.state.data,'ccccccccccc');
    // 传入navbBar参数
    const navBarProps = {
      leftVisible: true,
      leftFunc() {
        dispatch(routerRedux.goBack())
      },
      titleName: '收藏列表',
    }
    return (
      <div className={styles.rootBox}>

        {/*头部导航栏*/}
        <MyNavBar {...navBarProps}/>

        <div className={styles.main}>
          {/*列表 自动刷新*/}
          <InfiniteScroll
            pageStart={0}
            loadMore={(e) => this.loadFunc(e)}
            hasMore={false}
            threshold={100}
            loader={<div className="loader"
                         style={{fontSize: ".28rem", lineHeight: ".36rem", textAlign: "center", marginBottom: ".3rem"}}
                         key={0}>加载中...</div>}
          >
            <div className={styles.cList}>
              <div className={styles.listTitle}>
                <span className={state === 1 ? styles.active : ''} onClick={() => this.chgState(1)}>商品收藏</span>
                <span className={state === 2 ? styles.active : ''} onClick={() => this.chgState(2)}>店铺收藏</span>
              </div>

              {
                state===1?
                  (   collectionList.map((i, index) => {

                    if (!i.goodsData._id) {
                      return;
                    } else {
                      return (
                        <div key={index} className={styles.goodItem}
                             onClick={() => history.push('/gooddetail?_id=' + i.goodsData._id)}>
                          <div className={styles.itemLeft}>
                            <img src={APIHost + i.goodsData.cover} alt=""/>
                          </div>
                          <div className={styles.itemRight}>
                            <p className={styles.name}>{i.goodsData.name}</p>
                            <p className={styles.prop}>{i.goodsData.introduction}</p>
                            <p
                              className={styles.price}>¥{Number(i.goodsData.model[0].propertyOriginalPrice).toFixed(2)}</p>
                            <p className={styles.num}>库存：{i.goodsData.stock}</p>
                          </div>
                        </div>
                      )
                    }

                  })):(this.state.data.length>0?this.state.data.map((item,index)=>(
                    <div key={index} className={styles.goodItem}
                         onClick={() => history.push('/shop?_id=' + item.shopId)}
                    >
                      <div className={styles.itemLeftT}>
                        <img src={APIHost+item.shopImg} alt=""/>
                      </div>
                      <div className={styles.itemRight}   style={{paddingLeft:'1rem'}}>
                        <p className={styles.name}>{item.shopName}</p>
                        <p className={styles.prop}></p>
                      </div>
                    </div>
                  )):'页面丢了')
              }
            </div>
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}
