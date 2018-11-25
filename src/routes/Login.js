import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {login} from '../utils/fetch';
import styles from "./styles/login.less";
import {Button, Toast, List, InputItem} from 'antd-mobile';
import * as external from '../services/external';
import Logo from '../assets/icon/logo.png';

@connect(state => ({shopData: state.user}))
export default class Login extends Component {

  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };
  }

  // 按钮的disabled属性更改
  chgDisabled(disabled) {
    this.setState({disabled})
  }

  // 登录
  async goLogin() {
    const {dispatch} = this.props;
    this.chgDisabled(true);
    const username = this.username.state.value;
    const password = this.password.state.value;
    if (username === '') {
      Toast.offline('请输入您的账号!', 2);
      this.chgDisabled(false);
      return;
    }
    if (password === '') {
      Toast.offline('请输入您的密码!', 2);
      this.chgDisabled(false);
      return;
    }
    const value = await external.login({username, password});
    if (value.status) {
      Toast.success('登录成功!', 2, () => {
        login(value.resource.username, value.resource.password);
        localStorage.setItem('pw',this.password.state.value);
        dispatch(routerRedux.push('/'));
      });
    } else {
      Toast.fail(value.message, 2, () => {
        this.chgDisabled(false);
      });
    }
  }

  componentDidMount() {
    if(localStorage.getItem('user')){
      let user=JSON.parse(localStorage.getItem('user'));
      this.username.state.value=user.username;
    }
    if(localStorage.getItem('pw')){
      let pw=localStorage.getItem('pw');
      this.password.state.value=pw;
    }
  }

  render() {
    const {history, dispatch} = this.props;
    const {disabled} = this.state;
    return (
      <div className={styles.rootBox}>
        <style>
          {`
                        .am-input-item{
                            padding-top: .4rem;
                            height:1.28rem !important;
                        }
                        .am-button .am-button-icon{
                            width: 0.3rem;
                            height: 0.3rem;
                        }
                    `}
        </style>
        <div className={styles.main}>
          <div className={styles.logoBox}>
            <img src={Logo} alt=''/>
          </div>
          <List className={styles.inputList}>
            <InputItem type='number' maxLength='11' autoFocus placeholder='请输入帐号' ref={el => this.username = el}/>
            <InputItem type='password' placeholder='请输入密码' autoFocus  onExtraClick={() => history.push('/chgpwd')} extra='忘记密码'
                       ref={el => this.password = el}/>
          </List>
          <div className={styles.btnBox}>
            <Button type='primary' disabled={disabled} loading={disabled} onClick={() => this.goLogin()}>登录</Button>
          </div>
          <p className={styles.reg} onClick={() => history.push('/reg')}>注册新帐号</p>
        </div>
      </div>
    )
  }
}
