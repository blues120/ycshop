import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/grouponList.less";
import { Button,Toast} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import good01 from '../assets/images/good01.png';
@connect(state => ({shopData: state.shop}))
export default class GrouponList extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            selectedTabBar: "shop"
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
            titleName:'团购',
            background:'#FFFFFF',
            titleColor:'#333333',
            sideColor:'#333333',
        }
        
        return (
            <div className={styles.rootBox}>
                
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    {/* 商品 */}
                    <div className={styles.goodItem}>
                        <div className={styles.imgBox}>
                            <img src={good01} alt=""/>
                        </div>
                        <div className={styles.info}>
                            <p className={styles.name}><span>「2人团」</span>【手机专享】【澳洲本土版】德运全脂奶粉</p>
                            <div className={styles.price}>¥49.99 <span>当前返利<i>¥6.66</i></span></div>
                            <div className={styles.oldPrice}>
                                单买价¥75
                                <div className={styles.btnBox}>
                                    <Button type='primary' size='small'>去开团</Button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    {/* 商品 */}
                    <div className={styles.goodItem}>
                        <div className={styles.imgBox}>
                            <img src={good01} alt=""/>
                        </div>
                        <div className={styles.info}>
                            <p className={styles.name}><span>「2人团」</span>【手机专享】【澳洲本土版】德运全脂奶粉</p>
                            <div className={styles.price}>¥49.99 <span>当前返利<i>¥6.66</i></span></div>
                            <div className={styles.oldPrice}>
                                单买价¥75
                                <div className={styles.btnBox}>
                                    <Button type='primary' size='small'>去开团</Button>
                                </div>
                            </div>
                        </div>
                        
                    </div>


                </div>
            </div>
        )
    }
}
