import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/findings.less";
import {Button, Toast} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import good01 from '../assets/images/good01.png';

@connect(state => ({shopData: state.shop}))
export default class Findings extends Component {

  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      selectedTabBar: "findings"
    };
  }

  // async componentDidMount() {
  //     // const data=await
  // }

  render() {
    const {history, dispatch} = this.props;
    // 传入navbBar参数
    const navBarProps = {
      leftVisible: true,
      leftFunc() {
        dispatch(routerRedux.goBack())
      },
      titleName: "发现",
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
          <div className={styles.topTab}>
            <span className={styles.active}>淘宝精选</span>
            <span>京东精选</span>
          </div>
          {/* 商品列表 */}
          <div className={styles.list}>
            {/* 商品 */}
            <div className={styles.goodItem}>
              <div className={styles.imgBox}>
                <img src={good01} alt=""/>
              </div>
              <div className={styles.info}>
                <p className={styles.name}>杠杠滴战衣服</p>
                <p className={styles.other}>当前返利<span>¥6.66</span></p>
                <p className={styles.prcie}>¥<span>999.99</span></p>
              </div>
            </div>
            {/* 商品 */}
            <div className={styles.goodItem}>
              <div className={styles.imgBox}>
                <img src={good01} alt=""/>
              </div>
              <div className={styles.info}>
                <p className={styles.name}>杠杠滴战衣服</p>
                <p className={styles.other}>当前返利<span>¥6.66</span></p>
                <p className={styles.prcie}>¥<span>999.99</span></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
