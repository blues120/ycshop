import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/shop.less";
import { Button,Toast,Icon,WhiteSpace} from 'antd-mobile';
import * as fetch from '../services/shop';
import InfiniteScroll from 'react-infinite-scroller';
import GoodItem from '../components/GooodItem';
let queryString = require('querystring');
@connect(state => ({shopData: state.shop}))
export default class Shop extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
          check:false,
          _id:'',
          status:''
        };
    }

    async componentDidMount(){
        const {dispatch,location}=this.props;
        location.search=location.search.replace("?","")
        const parsed = queryString.parse(location.search);
        if(parsed._id){
            this.setState({_id:parsed._id})
          const data=await fetch.getDp(parsed._id);
          console.log(data,'@!!@---');
          this.setState({check:data.status})
        }
    }
   // async componentDidMount(){
   //    const data=await fetch.getDp();
   //   console.log(data,'@');
   // }
    //加载更多的方法,写法固定,只需替换变量名
    loadFunc(e){
        const {dispatch,shopData}=this.props;
        const { _id }=this.state;
        let page=shopData.pagination.page+1;
        dispatch({
          type:"shop/getShopList",
          payload:{
            _id,
            page,
            size:10
          }
        })
    }
  async handleCheckClick(){
      this.setState({check:!this.state.check});
    console.log(this.state.check,'!');
    let status=null;
    if(!this.state.check){
      status=1;
    }else{
      status=0;
    }
    const data=await fetch.postSp({state:status,shopId:this.state._id});
    Toast.success(data.message,1);
    console.log(data,'!!!!!!@!');
  };
    render() {
        const {history,dispatch,shopData}=this.props;

        let shopInfo=shopData.shopInfo;
        let shopList=shopData.shopList;
        console.log(shopInfo);
        // 列表是否有下一页
        let hasMore=shopData.pagination.hasMore;
        // 商品列表的参数
        const goodListProps = {
            goodData: shopList,
            tapItem(item){
                dispatch(routerRedux.push("/gooddetail?_id="+item._id))
            }
        }
        return (
            <div className={styles.rootBox}>

                <div className={styles.main}>
                    {/* 头部商家信息 */}
                    <div className={styles.topInfo}>
                        {/* 返回按钮 */}
                        <div className={styles.navbar}>
                            <Icon type='left' color='#FFFFFF' onClick={()=>history.goBack()}  />
                        </div>

                        {/* 商家信息 */}
                        <div className={styles.shopInfo}>
                            <div className={styles.iconBox}>
                                <img src={APIHost+shopInfo.merchant_logo} alt=""/>
                            </div>
                            <div className={styles.infoBox}>
                                <p className={styles.name}>{shopInfo.merchant_name}</p>
                                <p className={styles.detail}>{shopInfo.merchant_describe}</p>
                              <div className={styles.dpcz}><p className={styles.p1} onClick={this.handleCheckClick.bind(this)}><img src={(this.state.check?(require('../assets/images/xz.png')):(require('../assets/images/wxz.png')))} alt=""/></p><p>收藏店铺</p></div>
                            </div>
                        </div>
                    </div>
                    {/* 留白 */}
                    <WhiteSpace size='sm'></WhiteSpace>
                    {/*列表 自动刷新*/}
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
