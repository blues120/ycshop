import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/applyMer.less";
import { Button,Toast,List,InputItem,ImagePicker,Picker} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import options from '../components/AddrList';
import * as external from '../services/external';
const Item=List.Item;
@connect(state => ({userData: state.user}))
export default class ChgPwd extends Component {
    // disabled,area,filePhoto,fileCardA,fileCardB
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            disabled:false,
            codeExtra:'获取验证码',
        };
    }
    
    // 按钮的disabled属性更改
    chgDisabled(disabled){
        this.setState({disabled})
    }
    // 获取验证码
    async GetCode(){
        if (this.state.codeExtra!=="获取验证码") {
            return;
        }
        const mobile=this.mobile.state.value;
          if (mobile.length!==11) {
            Toast.fail("手机格式错误",2)
            return;   
          }
          const value =await external.getResetCode({mobile});
          if (value.status) {
            Toast.success("获取成功",2)
          }else{
            Toast.fail(value.message,2);
            return
          }
          const _this=this;
          let num=120;
          let Countdown=setInterval(function(){
              num=num-1;
              if (num>=0) {
                _this.setState({codeExtra:num+""});
                return;
              }
              _this.setState({codeExtra:'获取验证码'});
              clearInterval(Countdown);
          },1000)
    }
    // 
    async chgPwd(){
      let reg=/^\d+$/;
        this.chgDisabled(true);
        const {dispatch} =this.props;
        let mobile=this.mobile.state.value;
        let VerificationCode=this.VerificationCode.state.value;
        let password=this.password.state.value;
        let tranpwd=this.tranpwd.state.value;
        if(mobile===''){Toast.offline('请填写手机号码',2);this.chgDisabled(false);return};
        if(VerificationCode===''){Toast.offline('请填写验证码',2);this.chgDisabled(false);return};
        if(password===''){Toast.offline('请填写登录密码',2);this.chgDisabled(false);return};
        if(tranpwd===''){Toast.offline('请填写支付密码',2);this.chgDisabled(false);return};
      if(!reg.test(tranpwd)){Toast.offline('请填写数字',2);this.chgDisabled(false);return};
        let sql={mobile,VerificationCode,password,tranpwd};
        const value=await external.chgPwd(sql);
        if(value.status){
            Toast.success(value.message,2,()=>{
                dispatch(routerRedux.push('/login'));
            });
            
        }else{
            Toast.fail(value.message,2);
            this.chgDisabled(false);
        }
    }
    render() {
        const {history,dispatch}=this.props;
        const {disabled,codeExtra}=this.state;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'修改密码',
        }
       
        
        return (
            <div className={styles.rootBox}>
                <style>
                    {`
                        .am-list-body {
                            border-top: none;
                        }
                        .am-list-body::before{
                            visibility: hidden;
                        }
                        .am-list-item.am-input-item {
                            height: 0.88rem;
                            padding-left: 0rem;
                        }
                        
                    `}
                </style>
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    <List className={styles.list}>
                        <p className={styles.title}>手机号码：</p>
                        <InputItem type='number' maxLength={11} placeholder='' ref={el=>this.mobile =el} />
                        <p className={styles.title}>验证码：</p>
                        <InputItem type='number' maxLength={6} extra={codeExtra} onExtraClick={()=>this.GetCode()} ref={el=>this.VerificationCode=el} />
                        <p className={styles.title}>登录密码：</p>
                        <InputItem type='password' placeholder='' ref={el=>this.password=el} />
                        <p className={styles.title}>交易密码：</p>
                        <InputItem type='password' placeholder='' ref={el=>this.tranpwd=el} />
                    </List>
                    <div className={styles.btnBox}>
                        <Button type='primary' disabled={disabled} loading={disabled} onClick={()=>this.chgPwd()} >确认提交</Button>`
                    </div>
                </div>
            </div>
        )
    }
}
