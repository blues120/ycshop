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
export default class Recharge extends Component {
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            type:1,
            disabled:false,
            way:1,
            bankCard:{}
        };
    }
    componentWillMount(){
        const {history,dispatch,location}=this.props;
        location.search=location.search.replace("?","")
        const parsed = queryString.parse(location.search);
        this.setState({
            type:parsed.type
        })
    }
    // 按钮的disabled属性更改
    chgDisabled(disabled){
        this.setState({disabled})
    }

    // 充值方式
    selectType(way){
        this.setState({
            way
        })
    }

    // 弹窗选择银行卡
    showActionSheet = () => {
        const {dispatch,userData}=this.props;
        const cardList=userData.cardList;
        let BUTTONS = ['添加银行卡', '取消'];
        let cardArr=[];
        cardList.map((i,index)=>{
            cardArr.push(i.bankName+i.bankCard.slice(-4))
        })
        BUTTONS=cardArr.concat(BUTTONS);
        
        ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: BUTTONS.length - 1,
          destructiveButtonIndex: BUTTONS.length - 2,
          title: '选择提现银行卡',
          maskClosable: false,
          'data-seed': 'logId',
          wrapProps,
        },
        (buttonIndex) => {
            if(buttonIndex===cardArr.length){
                dispatch(routerRedux.push('/bankcardedit'))
            }else if(buttonIndex===cardArr.length+1){
                return;
            }else{
                this.setState({
                    bankCard:cardList[buttonIndex]
                })
            }
            
        });
      }

    // 确认提交
    async goSubmit(){
        this.chgDisabled(true);
        const {history,dispatch,userData}=this.props;
        const userInfo=userData.user;
        const {type,way,bankCard}=this.state;
        let value;
        let money=this.money.state.value;
        if(money===''){Toast.offline('请填写金额',2);this.chgDisabled(false);return};

        // 当为提现市
        if(type==='1'){
            if(Number(money)<100){Toast.offline('提现金额需大于100',2);this.chgDisabled(false);return};
            if(Number(money)>userInfo.gold){Toast.offline('您的余额不足',2);this.chgDisabled(false);return};
            if(!bankCard._id){Toast.offline('请选择银行卡',2);this.chgDisabled(false);return};
            
            let sql={apply:{...bankCard,money}}
            delete sql.apply._id;
            sql.apply.bankcardId=bankCard._id;
            value=await fetch.recall(sql);
        }else if(type==='2'){
            this.chgDisabled(false)
            return;
        }else if(type==='3'){
            if(Number(money)<100){Toast.offline('转换金额需大于100',2);this.chgDisabled(false);return};
            if(Number(money)>userInfo.kyJifen){Toast.offline('您的余额不足',2);this.chgDisabled(false);return};
            let sql={number:money};
            value=await fetch.exchange(sql);
        }else{
            return;
        }

        if(value.status){
            Toast.success(value.message,2);
            dispatch(routerRedux.goBack())
        }else{
            Toast.fail(value.message,2);
            this.chgDisabled(false)
        }
        
    }

    // 充值 

    async recharge(tranpwd ){
        this.chgDisabled(true);
        const {history,dispatch,userData}=this.props;
        const userInfo=userData.user;
        const {type,way,bankCard}=this.state;
        let value;
        let total_fee=this.money.state.value;
        if(total_fee===''){Toast.offline('请填写金额',2);this.chgDisabled(false);return};
        if(way===1){
            value= await fetch.rechange({tranpwd,total_fee});
        }else if(way===2){
            this.chgDisabled(false)
            Toast.offline('微信充值暂未开放!',2);
            return;
        }
        if(value.status){
            Toast.success('获取成功,即将前往支付',2,()=>{
                window.location=value.resource;
            });
        }else{
            Toast.fail(value.message,2);
            this.chgDisabled(false)
        }
        
    }
    render() {
        const {history,dispatch,userData}=this.props;
        const cardList=userData.cardList;
        const systemConfig=userData.systemConfig;
        const userInfo=userData.user;
        const {type,disabled,way,bankCard}=this.state;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:type==='1'?'我要提现':type==='2'?'我要充值':'积分转换余额',
            rightContent:type==='1'?'提现记录':type==='2'?'充值记录':'转换记录',
            rightFunc(){
                // dispatch(routerRedux.push('/rechargelist?type='+type))
                if(type==='1'){
                    dispatch(routerRedux.push('/recalllist'))
                }else if(type==='2'){
                    dispatch(routerRedux.push('/rechargelist'))
                }else if(type==='3'){
                    dispatch(routerRedux.push('/exchangelist'))
                }
            }
        }
        
        return (
            <div className={styles.rootBox}>
                
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    <div className={styles.content}>
                        {/* 头部标题或显示银行卡 */}
                        {
                            type==='1'?
                            <p className={styles.tiTitle} onClick={this.showActionSheet}>{bankCard._id?bankCard.bankName+bankCard.bankCard.slice(-4):'点击选择银行卡'}</p>
                            :
                            type==='2'?
                            <p className={styles.title}>充值金额</p>
                            :
                            <p className={styles.title}>转换金额</p>
                        }
                        
                        {/* 数量输入框 */}
                        <List className={styles.numInput}>
                            <InputItem
                                type="number"
                                maxLength={9}
                                ref={el=>this.money=el}
                            >
                                <span className={styles.inputLabel}>¥</span>
                            </InputItem>
                        </List>
                        {/* 当前余额 */}
                        <p className={styles.number}>{type==='1'?'现金余额'+Number(userInfo.gold).toFixed(2)+'(需扣除手续费'+systemConfig.shouxufei*100+'%)':type==='2'?'现金余额'+Number(userInfo.gold).toFixed(2):'可转换积分'+Number(userInfo.kyJifen).toFixed(2)}</p>
                        {/* 确认按钮 */}
                        <div className={styles.btnBox}>
                            {
                                type==='2'?
                                <Button type='primary' disabled={disabled} loading={disabled} onClick={() => prompt(
                                        '支付密码',
                                        '请输入您的支付密码',
                                        [
                                            { text: '取消' },
                                            { text: '提交', onPress: password => this.recharge(password)},
                                        ],
                                        'secure-text',
                                        )}
                                >确认</Button>
                                :
                                <Button type='primary' disabled={disabled} loading={disabled} onClick={()=>this.goSubmit()} >确认</Button>
                            }
                        </div>

                        {/* 充值时的充值方式选择 */}
                        <div className={type==='2'?styles.checkRow:styles.hide} >
                            <div>
                                <Checkbox checked={way===1} onChange={()=>this.selectType(1)} />
                                <img src={alipay} alt=""/>
                            </div>
                            <div>
                                <Checkbox checked={way===2}  onChange={()=>this.selectType(2)} />
                                <img src={wechat} alt=""/>
                            </div>
                        </div>




                    </div>




                </div>
            </div>
        )
    }
}
