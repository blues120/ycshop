import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/bankCard.less";
import { Button,Toast} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
@connect(state => ({userData: state.user}))
export default class BankCard extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            selectedTabBar: "shop"
        };
    }


    render() {
        const {history,dispatch,userData}=this.props;
        const {cardList}=userData;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'我的银行卡',
            rightContent:'添加',
            rightFunc(){
                dispatch(routerRedux.push('/bankcardedit'))
            }

        }
        
        
        return (
            <div className={styles.rootBox}>
                
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    {/* 银行卡子项 */}
                    {
                        cardList.map((i,index)=>{
                            let secretNumber=i.bankCard.slice(-4);
                            return(
                                <div key={index} className={styles.cardItem}>
                                    <p>{i.bankName}</p>
                                    <p>{i.cardTypeName}</p>
                                    <p>**** **** **** **** {secretNumber}</p>
                                </div>
                            )
                        })
                    }
                    
                </div>
            </div>
        )
    }
}
