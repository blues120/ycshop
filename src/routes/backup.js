import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/test.less";
import { Button,Toast} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
@connect(state => ({shopData: state.shop}))
export default class IndexPage extends Component {

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
            titleName:"这是一个标题",
        }
        // 传入tabBar参数
        const tabBarProps = {
            selectedTabBar: this.state.selectedTabBar,
            history
        }
        
        return (
            <div className={styles.rootBox}>
                
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>
                {/*底部标签栏*/}
                <MyTabBar {...tabBarProps}/>

                <div className={styles.main}>

                </div>
            </div>
        )
    }
}
