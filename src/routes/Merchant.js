import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/merchant.less";
import { Button,Toast} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import good01 from '../assets/images/good01.png';
import {timetrans} from '../timetrans';
import InfiniteScroll from 'react-infinite-scroller';
@connect(state => ({userData: state.user}))
export default class Merchant extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            state:1
        };
    }

    // 更改state
    chgState(state){
        this.setState({
            state
        },()=>{
            this.loadFunc(true)
        })
    }
    //加载更多的方法,写法固定,只需替换变量名
    loadFunc(changed){
        const {dispatch,userData}=this.props;
        const {state}=this.state;
        let page=userData.pagination.page+1;
        let payload={page,size:10,state};
        if(changed){payload.changed=true};
        dispatch({
          type:"user/getMerchant",
          payload
        })
    }
    componentDidMount(){

    }
    render() {
      var reg = /^(\d{6})\d+(\d{4})$/;
        const {history,dispatch,userData}=this.props;
        const {state}=this.state;
        let hasMore=userData.pagination.hasMore;
        let merchant=userData.merchant;
      let merchantList=userData.merchantList;
      // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'店铺收益',
        }


        return (
            <div className={styles.rootBox}>

                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    {/*头部收益信息*/}
                    <div className={styles.topInfo}>
                        <span className={styles.title}>商家货款</span>
                        <div className={styles.info}>
                            <div className={styles.circle}>
                                <div className={styles.content} onClick={()=>history.push('/recharget?type=1')}>
                                    <span>{Math.round(parseFloat((merchant.wait_gold?merchant.wait_gold:0)*100))/100}</span>
                                    <span>待结算货款</span>
                                </div>
                            </div>
                            <div className={styles.circle}>
                                <div className={styles.content}>
                                    <span>{Math.round(parseFloat((merchant.already_gold?merchant.already_gold:0)*100))/100}</span>
                                    <span>已提现货款</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*列表 自动刷新*/}
                    <InfiniteScroll
                        pageStart={1}
                        loadMore={(e)=>this.loadFunc(false)}
                        hasMore={hasMore}
                        threshold={100}
                        loader={<div className="loader" style={{fontSize:".28rem",lineHeight:".36rem",textAlign:"center",marginBottom:".3rem"}} key={0}>加载中...</div>}
                    >
                        <div className={styles.list}>
                            {/* 切换tab */}
                            <div className={styles.listTitle}>
                                <span className={state===1?styles.active:''} onClick={()=>this.chgState(1)}>货款订单记录</span>
                                <span className={state===2?styles.active:''} onClick={()=>this.chgState(2)}>货款提现记录</span>
                            </div>
                            {/* 内容 */}
                            <div className={styles.content}>
                                {/* item */}
                                {
                                  merchantList.length>0?merchantList.map((i,index)=>{
                                      if(state===1){
                                        return(
                                          <div key={index} className={styles.cardItem}>
                                            <p><span>订单编号： </span><span>{i.merchantOrderNumber}</span></p>
                                            <p><span>订单金额： </span><span>{i.gold?(Math.round(parseFloat((i.gold)*100))/100):0}</span></p>
                                            <p><span>订单时间： </span><span>{timetrans(i.createTime)}</span></p>
                                          </div>
                                        )
                                      }else if(state===2){
                                        return(
                                          <div key={index} className={styles.cardItem}>
                                            <p><span>提现编号： </span><span>{i.merchantOrderNumber}</span></p>
                                            <p><span>提现金额： </span><span>{i.waitGold?(Math.round(parseFloat((i.waitGold)*100))/100):0}</span></p>
                                            <p><span>申请状态： </span><span>{i.state===1?'等待审核':(i.state===2?'审核通过':'审核驳回')}</span></p>
                                            <p><span>银行名称： </span><span>{i.bankCardInfo?i.bankCardInfo.bankName:''}</span></p>
                                            <p><span>银行卡号： </span><span>{i.bankCardInfo?(i.bankCardInfo.bankCard).replace(reg,'$1******$2'):''}</span></p>
                                            <p><span>申请时间： </span><span>{timetrans(i.createTime)}</span></p>
                                          </div>
                                        )
                                      }

                                    }):''
                                }
                            </div>

                        </div>
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}
