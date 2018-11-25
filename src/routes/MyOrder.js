import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/myorder.less";
import { Button,Toast,Modal} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import InfiniteScroll from 'react-infinite-scroller';

const alert=Modal.alert;
@connect(state => ({userData: state.user}))
export default class MyOrder extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            state:-1
        };
    }

    // 更改state
    chgState(state){
        this.setState({state},()=>{
            this.loadFunc(0,true);
        })
    }
    //加载更多的方法,写法固定,只需替换变量名
    loadFunc(e,changed){
        const {dispatch,userData}=this.props;
        const {state} =this.state;
        let page=userData.pagination.page+1;
        let payload={page,size:5,state};
        if(changed){
            payload.changed=changed;
            payload.page=1;
        };
        dispatch({
          type:"user/getOrderList",
          payload
        })
    }

    // 确认收货
    async updateOrder(_id){
        const {dispatch,userData}=this.props;
        const {state} =this.state;
        let page=userData.pagination.page+1;
        const value=await fetch.updateOrder({_id,state:4});
        if(value.status){
            dispatch({
                type:"user/getOrderList",
                payload:{
                    page:1,
                    state,
                    changed:true,
                    size:10
                }
            })
        }
    }
    render() {
        const {history,dispatch,userData}=this.props;
        let orderList=userData.orderList;
        let hasMore=userData.pagination.hasMore;
        const {state} =this.state;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.push('/mine'))
            },
            titleName:"我的订单",
        }

        return (
            <div className={styles.rootBox}>

                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    {/* 头部标签 */}
                    <div className={styles.topTab}>
                        <span className={state===-1?styles.active:''} onClick={()=>this.chgState(-1)} >全部</span>
                        <span className={state===1?styles.active:''} onClick={()=>this.chgState(1)}>待付款</span>
                        <span className={state===2?styles.active:''} onClick={()=>this.chgState(2)}>待发货</span>
                        <span className={state===3?styles.active:''} onClick={()=>this.chgState(3)}>待收货</span>
                        <span className={state===4?styles.active:''} onClick={()=>this.chgState(4)}>已完成</span>
                    </div>
                    {/*列表 自动刷新*/}
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={(e)=>this.loadFunc(e)}
                        hasMore={hasMore}
                        threshold={100}
                        loader={<div className="loader" style={{fontSize:".28rem",lineHeight:".36rem",textAlign:"center",marginBottom:".3rem"}} key={0}>加载中...</div>}
                    >
                    <div className={styles.list}>
                        {/* 子项 */}
                        {
                            orderList.map((i,index)=>{
                                return(
                                    <div key={index} className={styles.item}>
                                        <div className={styles.info}>
                                            <div className={styles.img}>
                                                <img src={APIHost+i.goodsList[0].cover} alt=""/>
                                            </div>
                                            <div className={styles.rightInfo}>
                                                <p className={styles.name}>{i.goodsList[0].name}</p>
                                                <p className={styles.prop}>{i.goodsList[0].guigeText.propertyCombination} 数量*{i.goodsList[0].number}</p>
                                                <p className={styles.price}><span>¥{i.payable}</span><span style={{paddingLeft:'.2rem',color:'#a29c9c',fontSize:'.24rem'}}>{i.activeState===1?'(活动价)':''}</span></p>
                                            </div>
                                        </div>
                                        <div className={styles.btnBox}>
                                            <div>
                                                <span>{i.state===1?'待付款':i.state===2?'待发货':i.state===3?'待收货':i.state===4?'已完成':'订单失效'}</span>
                                            </div>
                                            <div>
                                                <span onClick={()=>history.push('/myorderdetail?_id='+i._id)} >详情</span>
                                                {i.state==4?<span onClick={()=>history.push('/myorderdetail?_id='+i._id)} >评价</span>:''}
                                                {i.state===1?<Button type='ghost' size='small' onClick={()=>history.push('/payorder?_id='+i._id)} >付款</Button>:''}
                                                {i.state===3?<Button type='ghost' size='small' onClick={
                                                    () =>
                                                        alert('确认收货', '确认收到货物了吗???', [
                                                            { text: '取消'},
                                                            { text: '确认', onPress: () => this.updateOrder(i._id) },
                                                        ])
                                                } >已收货</Button>:''}
                                            </div>

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
