import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/recharge.less";
import { Button,Toast,List,InputItem,Checkbox,ActionSheet,Modal} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import alipay from '../assets/icon/alipay.png';
import wechat from '../assets/icon/wechat.png';
import yuepay from '../assets/icon/yuepay.png';
const queryString = require('querystring');
const prompt=Modal.prompt;

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
@connect(state => ({userData: state.user}))
export default class Transfer extends Component {
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            _id:'',
            disabled:false,
          flag:true,
            way:1,
          run:false
        };
    }
    componentWillMount(){
        const {history,dispatch,location}=this.props;
        location.search=location.search.replace("?","")
        const parsed = queryString.parse(location.search);
        this.setState({
            _id:parsed._id
        })
    }
    // 按钮的disabled属性更改
    chgDisabled(disabled){
        this.setState({disabled})
    }

    // 充值方式
    selectType(way){
      if(way==3){
        this.setState({run:true})
      }else{
        this.setState({run:false})
      }
      this.setState({
            way
        })
    }

   


    // 确认提交
    // async goSubmit(tranpwd){
    //   this.chgDisabled(true);
    //     const {history,dispatch,userData}=this.props;
    //     const userInfo=userData.user;
    //   const {way,_id}=this.state;
    //     let money=this.money.state.value;
    //     if(money===''){Toast.offline('请填写金额',2);this.chgDisabled(false);return};
    //     if(Number(money)>userInfo.gold){Toast.offline('您的余额不足',2);this.chgDisabled(false);return};
    //     let value;
    //     let sql={tranpwd,money,merchantId:_id};
    //     if(way===1){
    //         value=await fetch.outlineAlipay(sql);
    //     }else if(way===2){
    //         Toast.offline('微信支付暂未开放',2);this.chgDisabled(false);return
    //     }else if(way===3){
    //         Toast.offline('余额支付正在开放',2);this.chgDisabled(false);return
    //     }
    //     if(value.status){
    //         Toast.success('请求成功,即将前往支付',2,()=>{
    //             window.location=value.resource;
    //         });
    //     }else{
    //         Toast.fail(value.message,2);
    //         this.chgDisabled(false)
    //     }
    // }
  async goSubmit(tranpwd){

      this.setState({flag:false});
      if(this.state.flag){
        // this.chgDisabled(true);
        const {history,dispatch,userData}=this.props;
        const userInfo=userData.user;
        const {way,_id}=this.state;
        let money=this.money.state.value;
        if(!userInfo._id){ Toast.offline('请先登录',2);dispatch(routerRedux.push('/login'));return}
        if(money==='' || money<0){Toast.offline('请填写正确的金额',2);this.chgDisabled(false);return};
        let value;
        let sql={tranpwd,money,merchantId:_id};
        if(way===1){// 支付宝支付
          let sql={money,merchantId:_id,tranpwd:'123456'};
          value=await fetch.outlineAlipay(sql);
        }else if(way===2){      //微信支付
          Toast.offline('微信支付暂未开放',2,()=>this.setState({flag:true}));this.chgDisabled(false);return
        }else if(way===3){
          // 余额支付


          let yueE=await fetch.outlineYueE(sql);
          yueE.status?Toast.success('付款成功',1.5,()=>history.push('/mine')):Toast.offline(yueE.message,1.5,()=>this.setState({flag:true}));
          this.chgDisabled(false);return;
          // if(Number(money)>userInfo.gold){Toast.offline('您的余额不足',2);this.chgDisabled(false);return};
          // Toast.offline('余额支付正在开放',2);this.chgDisabled(false);return
        }
        if(value.status){
          Toast.success('请求成功,即将前往支付',2,()=>{
            window.location=value.resource;
          });
        }else{
          Toast.fail(value.message,2,()=>this.setState({flag:true}));
          this.chgDisabled(false)
        }
      }

  }


    render() {
        const {history,dispatch,userData}=this.props;
        const systemConfig=userData.systemConfig;
        const userInfo=userData.user;
        const {disabled,way}=this.state;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'线下付款',
            rightContent:'付款记录',
            rightFunc(){
                dispatch(routerRedux.push('/transferlist'))
            }
        }
        
        return (
            <div className={styles.rootBox}>
                
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    <div className={styles.content}>
                        {/* 头部标题或显示银行卡 */}
                        <p className={styles.title}>向商家付款</p>
                        
                        {/* 数量输入框 */}
                        <List className={styles.numInput}>
                            <InputItem
                                type="text"
                                maxLength={9}
                                ref={el=>this.money=el}
                            >
                                <span className={styles.inputLabel}>¥</span>
                            </InputItem>
                        </List>
                        {/* 当前余额 */}
                        {/* <p className={styles.number}>{'现金余额'+userInfo.gold}</p> */}
                        <p className={styles.number}>{'*付款操作无法撤回,请知悉!'}</p>
                        {/* 确认按钮 */}
                      {
                        this.state.run?( <div className={styles.btnBox}>
                          <Button type='primary' disabled={disabled} loading={disabled} onClick={() => prompt(
                            '支付密码',
                            '请输入您的支付密码',
                            [
                              { text: '取消' },
                              { text: '提交', onPress: password => this.goSubmit(password)},
                            ],
                            'secure-text',
                          )}
                          >确认</Button>
                        </div>):(<div className={styles.btnBox}>
                          <Button type='primary' disabled={disabled} loading={disabled} onClick={(password) => this.goSubmit(password)}>确认</Button>
                        </div>)
                      }



                        {/* 充值时的充值方式选择 */}
                        <div className={styles.checkRow} >
                            <div>
                                <Checkbox checked={way===1} onChange={()=>this.selectType(1)} />
                                <img src={alipay} alt=""/>
                            </div>
                            <div>
                                <Checkbox checked={way===2}  onChange={()=>this.selectType(2)} />
                                <img src={wechat} alt=""/>
                            </div>
                            {<div>
                                <Checkbox checked={way===3}  onChange={()=>this.selectType(3)} />
                                <img src={yuepay} alt=""/>
                            </div> }
                        </div>

                        




                    </div>


                    {/* 银行卡弹窗 */}


                </div>
            </div>
        )
    }
}
