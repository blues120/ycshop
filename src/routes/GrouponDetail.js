import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/grouponDetail.less";
import { Button,Toast,WhiteSpace} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import good01 from '../assets/images/good01.png';
@connect(state => ({shopData: state.shop}))
export default class GrouponDetail extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        const {history,dispatch}=this.props;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'团购详情',
            background:'#FFFFFF',
            titleColor:'#333333',
            sideColor:'#333333',
        }
        return (
            <div className={styles.rootBox}>
                <style>
                    {
                        `
                        .leftbtn {
                            background-color: #FFFFFF;
                            color:#FE4070;
                            border:1px solid #FE4070;
                        }
                        .rightbtn{
                            background-color: #FE4070;
                        }

                        `
                    }
                </style>
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>
                <div className={styles.main}>
                    {/* 主图 */}
                    <div className={styles.mainImg}>
                        <img src={good01} alt=""/>
                    </div>
                    {/* 留白 */}
                    <WhiteSpace></WhiteSpace>
                    {/* 商品信息 */}
                    <div className={styles.goodInfo}>
                        <p className={styles.infoPrice}><span>¥49.66</span><span>正常价¥499.00</span></p>
                        <p className={styles.infoTime}><span>还剩10天 19:08:39</span><span>逾期未成团自动退款</span></p>
                        <p className={styles.infoName}><span>「2人团」</span><span>【澳洲本土版】德运全脂奶粉5000g</span></p>
                    </div>
                    {/* 底部Tab */}
                    <div className={styles.tab}>
                        <div className={styles.tabLeft}>
                            <Button className="leftbtn" type='primary'>¥499.00<br/>单独买</Button>
                        </div>
                        <div className={styles.tabRight}>
                            <Button className="rightbtn" type='primary'>¥49.66<br/>我要拼团</Button>
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}
