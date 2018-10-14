/*
 * @Author: 杜梦 
 * @Date: 2018-07-02 17:17:46 
 * @Last Modified by: 杜梦
 * @Last Modified time: 2018-08-29 11:03:35
 */
import React from 'react';
import PropTypes from 'prop-types';
import styles from "./styles/tabBar.less";
import {Toast} from 'antd-mobile';

// 图标资源
import Tab5 from "../assets/tabicon/tab5.png";
import Tab51 from "../assets/tabicon/tab51.png"
import Tab4 from "../assets/tabicon/tab4.png";
import Tab41 from "../assets/tabicon/tab41.png"
import Tab3 from "../assets/tabicon/tab3.png";
import Tab31 from "../assets/tabicon/tab31.png"
import Tab2 from "../assets/tabicon/tab2.png";
import Tab21 from "../assets/tabicon/tab21.png"
import Tab1 from "../assets/tabicon/tab1.png";
import Tab11 from "../assets/tabicon/tab11.png";

// 子项可增删,样式自适应
// selectedTabBar:活动的tab,string
// history ,传入history用于点击跳转
const MyTabBar=({selectedTabBar,history}) =>{
  return(
    <div className={styles.tabBarBox}>

          <div className={styles.tabBarItem} onClick={()=>history.push('/')}>
              <img src={selectedTabBar==='shop'?Tab11:Tab1}></img>
              <span className={selectedTabBar==='shop'?styles.textActive:""}>首页</span>
          </div>
          <div className={styles.tabBarItem} onClick={()=>history.push('/classify')}>
              <img src={selectedTabBar==='classify'?Tab51:Tab5}></img>
              <span className={selectedTabBar==='classify'?styles.textActive:""}>分类</span>
          </div>
          <div className={styles.tabBarItem} onClick={()=>history.push('/cart')}>
              <img src={selectedTabBar==='cart'?Tab21:Tab2}></img>
              <span className={selectedTabBar==='cart'?styles.textActive:""}>购物车</span>
          </div>
          {/* <div className={styles.tabBarItem} onClick={()=>history.push('/findings')}>
              <img src={selectedTabBar==='findings'?Tab31:Tab3}></img>
              <span className={selectedTabBar==='findings'?styles.textActive:""}>发现</span>
          </div> */}
          <div className={styles.tabBarItem} onClick={()=>Toast.offline('暂未开放',2)}>
              <img src={selectedTabBar==='findings'?Tab31:Tab3}></img>
              <span className={selectedTabBar==='findings'?styles.textActive:""}>发现</span>
          </div>

          <div className={styles.tabBarItem} onClick={()=>history.push('/mine')}>
              <img src={selectedTabBar==='mine'?Tab41:Tab4}></img>
              <span className={selectedTabBar==='mine'?styles.textActive:""}>我的</span>
          </div>
    </div>
  )
}
MyTabBar.propTypes = {
    
}
export default MyTabBar