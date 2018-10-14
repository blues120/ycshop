import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/myOrderDetail.less";
import { Button,Toast,WhiteSpace} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import addressIcon from '../assets/icon/address.png';
import rightIcon from '../assets/icon/rightIcon.png';
import {timetrans} from '../timetrans';

@connect(state => ({userData: state.user}))
export default class MyOrderDetail extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    pingjia(orderId,goodId,pinglun){
        const {dispatch} =this.props;
        if(!pinglun){
            dispatch(routerRedux.push('/review?orderId='+orderId+'&goodId='+goodId))
        }
    }
    render() {
        const {history,dispatch,userData}=this.props;
        let orderDetail=userData.orderDetail;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:"订单详情",
        }


        return (
            <div className={styles.rootBox}>

                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>
                {
                    orderDetail._id?
                    <div className={styles.main}>
                        {/* 头部地址,选择地址 */}
                        <div className={styles.address}>
                            <span>
                                <img src={addressIcon} alt=""/>
                            </span>
                            <div>
                                <p className={styles.info}><span>收货人：{orderDetail.address.recipient}</span><span>{orderDetail.address.telephone}</span></p>
                                <p className={styles.addr}>收货地址：{orderDetail.address.province+orderDetail.address.city+orderDetail.address.area+orderDetail.address.address}</p>
                            </div>
                            <span>

                            </span>
                        </div>
                        {/* 分割 */}
                        <WhiteSpace size='sm' ></WhiteSpace>

                        {/* 商品 */}
                        {
                            orderDetail.goodsList.map((i,index)=>{
                                return(
                                    <div key={index} className={styles.goodItem}>
                                        <div className={styles.itemLeft}>
                                            <img src={APIHost+i.cover} alt=""/>
                                        </div>
                                        <div className={styles.itemRight}>
                                            <p className={styles.name}>{i.name}</p>
                                            <p className={styles.prop}>{i.guigeText.propertyCombination}</p>
                                            <p className={styles.price}>¥{i.price}</p>
                                            <p className={styles.num}>X{i.number}{orderDetail.state===4?<span onClick={()=>this.pingjia(orderDetail._id,i.id,i.pinglun)}>{i.pinglun?'已评价':'评价'}</span>:''}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }

                        {/* 分割 */}
                        <WhiteSpace size='sm' ></WhiteSpace>

                        {/* 订单其他信息*/}
                        <div className={styles.orderInfo}>
                            <p><span>订单编号</span>{orderDetail.orderNumber}</p>
                            <p><span>买家帐号</span>{orderDetail.xdUser}</p>
                            <p><span>联系方式</span>{orderDetail.userTelephone}</p>
                            <p><span>订单状态</span>{orderDetail.state===1?'待付款':orderDetail.state===2?'待发货':orderDetail.state===3?'待收货':orderDetail.state===4?'已完成':'订单失效'}</p>
                            <p><span>订单时间</span>{timetrans(orderDetail.createTime)}</p>
                        </div>
                    </div>
                    :
                    ''
                }
            </div>
        )
    }
}
