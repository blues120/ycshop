import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import styles from './index.less'

export default class Tab extends Component {
  render() {
    return (
      <nav className={styles.tabs}>
        <NavLink style={{backgroundSize: "1.28rem 1.06rem"}} exact  activeClassName={styles.active} to="/">
          <i className="iconfont icon-shouye"></i>
          <span>首页</span>
        </NavLink>
        <NavLink style={{backgroundSize: "1.28rem 1.06rem"}} exact  activeClassName={styles.active} to="/mine">
          <i className="iconfont icon-wode"></i>
          <span>我的</span>
        </NavLink>
        <NavLink style={{backgroundSize: "1.28rem 1.06rem",position:'relative'}}  exact activeClassName={styles.active} to="/mylink">
          <span className={styles.IS}><i className="iconfont icon-erweima"></i></span>
          <span style={{paddingTop:".4rem"}}>我要推广</span>
        </NavLink>
        <NavLink style={{backgroundSize: "1.7rem 1.06rem"}}  exact to="/furnace" activeClassName={styles.active}>
          <i className="iconfont icon-huo"></i>
          <span>分裂炉</span>
        </NavLink>
        <NavLink style={{backgroundSize: "1.58rem 1.06rem"}} exact  to="/market" activeClassName={styles.active}>
          <i className="iconfont icon-jiaoyi"></i>
          <span>交易市场</span>
        </NavLink>
      </nav>
    )

  }
}
