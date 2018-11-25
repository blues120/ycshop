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
export default class QrCode extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    copyCode=(url)=>{
        copy(url);
        Toast.success("复制成功!如未成功请手动复制!",2);
    }
    componentDidMount(){
    }
    render() {
        const {history,dispatch,userData}=this.props;
        const userInfo=userData.user;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'推广二维码',
        }
        
        return (
            <div className={styles.rootBox}>
                
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    <div className={styles.codeBox}>
                        <p className={styles.titleA}>感谢加入</p>
                        <p className={styles.titleB}>扫码下方二维码，享受更多优惠</p>
                        <QRCode className={styles.QRCode}  value={window.location.origin+"/reg?parentUsername="+userInfo.username} />
                    </div>
                    <p className={styles.url}>{window.location.origin+"/reg?parentUsername="+userInfo.username}</p>
                    <div className={styles.btnBox}>
                        <Button type="primary" size='small' onClick={()=>this.copyCode(window.location.origin+"/reg?parentUsername="+userInfo.username)} >复制推广链接</Button>
                    </div>
                </div>
            </div>
        )
    }
}
