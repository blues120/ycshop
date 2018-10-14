import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/flashSaleList.less";
import { Button,Toast} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import good01 from '../assets/images/good01.png';
@connect(state => ({shopData: state.shop}))
export default class FlashSaleList extends Component {

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
            titleName:'限时秒杀',
            background:'rgba(255,255,255,0)',
            titleColor:'#FFFFFF',
            sideColor:'#FFFFFF',
        }
        
        
        return (
            <div className={styles.rootBox}>
                
                
                <div className={styles.main}>
                    {/*头部导航栏和背景*/}
                    <div className={styles.top}>
                        <MyNavBar {...navBarProps}/>
                    </div>
                    {/* 商品列表 */}
                    <div className={styles.list}>
                        {/* 111 */}
                        <div className={styles.goodItem}>
                            <div className={styles.goodImg}>
                                <img src={good01} alt=""/>
                            </div>
                            <div className={styles.goodInfo}>
                                <p className={styles.timer}><span>00</span>天<span>00</span>天<span>00</span>天<span>00</span>天</p>
                                <p className={styles.name}>杠杠滴战衣服杠杠滴战衣服</p>
                                <div className={styles.slider}>
                                    <span className={styles.rectangle} style={{width:'10%'}}></span>
                                    <span className={styles.value}>库存还剩99件</span>
                                </div>
                                <div className={styles.price}>
                                    ¥ <span>65.8</span>
                                    <div className={styles.btn}>
                                        <Button type='primary' size='small'>马上抢</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 111 */}
                        <div className={styles.goodItem}>
                            <div className={styles.goodImg}>
                                <img src={good01} alt=""/>
                            </div>
                            <div className={styles.goodInfo}>
                                <p className={styles.timer}><span>00</span>天<span>00</span>天<span>00</span>天<span>00</span>天</p>
                                <p className={styles.name}>杠杠滴战衣服杠杠滴战衣服杠杠滴战衣服杠杠滴战衣服</p>
                                <div className={styles.slider}>
                                    <span className={styles.rectangle} style={{width:'50%'}}></span>
                                    <span className={styles.value}>库存还剩99件</span>
                                </div>
                                <div className={styles.price}>
                                    ¥ <span>65.8</span>
                                    <div className={styles.btn}>
                                        <Button type='primary' size='small'>马上抢</Button>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        )
    }
}
