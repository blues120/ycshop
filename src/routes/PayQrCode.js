import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/qrCode.less";
import { Button,Toast} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import copy from 'copy-to-clipboard';
var queryString = require('querystring');
var QRCode = require('qrcode.react');
@connect(state => ({userData: state.user}))
export default class PayQrCode extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    // 
    copyCode=(url)=>{
        copy(url);
        Toast.success("复制成功!如未成功请手动复制!",2);
    }
    render() {
        const {history,dispatch,userData}=this.props;
        let userInfo = userData.user;
      // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'收款二维码',
        }
        
        return (
            <div className={styles.rootBox}>
                
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                {
                    userInfo._id?
                    <div className={styles.main}>
                        <div className={styles.codeBox}>
                            <p className={styles.titleA}> 收款二维码 </p> 
                            <p className={styles.titleB}>扫码下方二维码，立即向我支付</p>
                            <QRCode className={styles.QRCode}  value={window.location.host+'/transfer?_id='+userInfo.merchantId} />
                        </div>
                        <p className={styles.url}>{window.location.host+'/transfer?_id='+userInfo.merchantId}</p>
                        <div className={styles.btnBox}>
                            <Button type="primary" size='small' onClick={()=>this.copyCode(window.location.host+'/transfer?_id='+userInfo.merchantId)} >复制支付链接</Button>
                        </div>
                    </div>
                    :
                    ''
                }
            </div>
        )
    }
}
