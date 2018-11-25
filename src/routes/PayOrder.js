import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/payOrder.less";
import { Button,Toast,List,InputItem,Checkbox,WhiteSpace,Modal} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import alipay from '../assets/icon/alipay.png';
import wechat from '../assets/icon/wechat.png';
import yuepay from '../assets/icon/yuepay.png';
const prompt = Modal.prompt;
const Item=List.Item;
const alert=Modal.alert;
@connect(state => ({shopData: state.shop}))
export default class PayOrder extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            disabled:false,
            type:1,
            minPrice:0
        };
    }

    // 按钮的disabled属性更改
    chgDisabled(disabled){
        this.setState({disabled})
    }

    // 更改支付方式
    chgType(e,type){
        this.setState({
            type
        })
    }

    // 计算金额
    componentwillMount(){
        const {shopData}=this.props;
        const orderInfo=shopData.orderInfo;
        const systemConfig=shopData.systemConfig;
        const userInfo=shopData.user;
        let minPrice=0;
        if(userInfo._id&&systemConfig.ysjfDKRate&&orderInfo.payable){
          if(orderInfo.activeState===1){
            this.setState({minPrice:orderInfo.payable})
          }else{
            let youhui=orderInfo.originalIntegral*systemConfig.ysjfDKRate+orderInfo.availableIntegral;
            minPrice=Math.round(parseFloat((orderInfo.payable-youhui)*100))/100;
            this.setState({minPrice})
          }


        }
    }
    // 计算金额
    componentWillReceiveProps(nextProps) {
      const {shopData} = nextProps;
      const orderInfo = shopData.orderInfo;
      const systemConfig = shopData.systemConfig;
      const userInfo = shopData.user;
      let minPrice = 0;
      if (userInfo._id && systemConfig.ysjfDKRate && orderInfo.payable) {
        if (orderInfo.activeState == 1) {
          minPrice = orderInfo.payable;
        } else {
          let youhui = orderInfo.originalIntegral * systemConfig.ysjfDKRate + orderInfo.availableIntegral;
          minPrice = Math.round(parseFloat((orderInfo.payable - youhui) * 100)) / 100;
        }
        this.setState({minPrice})
      }
    }

    // 余额不足提示
    cantAlert(password){
        alert('您的积分不足', '是否使用现金代替?', [
            { text: '取消', onPress: () => this.chgDisabled(false)},
            { text: '好的', onPress: () => this.pay(password)},
        ])
    }

    // 检测订单和余额
    checkInfo(password){
        this.chgDisabled(true);
        const {history,dispatch,shopData}=this.props;
        const {type,disabled,minPrice}=this.state;
        const orderInfo=shopData.orderInfo;
        const systemConfig=shopData.systemConfig;
        const userInfo=shopData.user;
        if(!userInfo._id||!systemConfig.ysjfDKRate||!orderInfo.payable){
            Toast.offline('信息有误,请刷新重试',2);
            this.chgDisabled(false);
            return;
        }
        if(orderInfo.originalIntegral>userInfo.ysJifen||orderInfo.availableIntegral>userInfo.kyJifen){
            this.cantAlert(password);
            return;
        }
        this.pay(password);

    }
    // 获取支付链接
    async pay(password){
        const {history,dispatch,shopData}=this.props;
        const {type}=this.state;
        const orderInfo=shopData.orderInfo;
        let orderId=orderInfo._id;
        let tranpwd=password;

        let value;
        if(type===1){
            Toast.offline('微信支付暂未开放!',2);
            this.chgDisabled(false);
            return;
        }else if(type===2){
            value= await fetch.getAlipay({orderId,tranpwd});
        }else if(type===3){
            value= await fetch.yuEPay({orderId,tranpwd});
        }
        if(value.status){
            if(type===1){

            }else if(type===2){
                Toast.success('请求成功,即将前往支付!',2,()=>{
                    window.location=value.resource;
                })
            }else if(type===3){
                Toast.success('支付成功!',2,()=>{
                    dispatch(routerRedux.push('/myorder'))
                })
            }
        }else{
            Toast.fail(value.message,2);
            this.chgDisabled(false);
        }

    }

    render() {
        const {history,dispatch,shopData}=this.props;
        const orderInfo=shopData.orderInfo;
      console.log(orderInfo,"???/噢哟CWT");
      const systemConfig=shopData.systemConfig;
      let list=orderInfo.goodsList?orderInfo.goodsList[0]:'';
      let guigeText=list.guigeText?list.guigeText:'';

      const {propertyOriginalPrice,propertyPrice}=guigeText;
      const userInfo=shopData.user;
        const {type,disabled,minPrice}=this.state;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'订单支付',
        }


        return (
            <div className={styles.rootBox}>
                <style>
                    {`
                        .am-list-item{
                            min-height: 1.08rem;
                        }
                        .am-list-content{
                            font-size: .28rem !important;
                        }
                    `}
                </style>
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>
                <div className={styles.main}>
                    {/* x显示订单金额 */}
                    <div className={styles.topInfo}>
                        <p className={styles.orderNumber}>订单号：{orderInfo.orderNumber}</p>

                        {/*<span className={styles.price}>¥{orderInfo.payable?Number(orderInfo.payable).toFixed(2):0}</span>*/}
                        {/*<span className={styles.oldPrice}>¥{orderInfo.payable?Number(orderInfo.payable).toFixed(2):0}</span>*/}
                      <span className={styles.price}>¥{propertyPrice}</span>
                      <span className={styles.oldPrice}>¥{propertyOriginalPrice}</span>
                        <p className={styles.jifen}><span>可用积分可抵扣：</span> <span>－ ¥{Number(orderInfo.activeState==0&&orderInfo.availableIntegral?orderInfo.availableIntegral:0).toFixed(2)}</span></p>
                        <p className={styles.jifen}><span>原始积分可抵扣：</span> <span>－ ¥{(Number(orderInfo.activeState==0&&orderInfo.originalIntegral?orderInfo.originalIntegral:0)*systemConfig.ysjfDKRate).toFixed(2)}</span></p>
                    </div>

                    {/* 显示个人积分余额 */}
                    <WhiteSpace size='xs'></WhiteSpace>
                    <div className={styles.chooseType}>
                        {/* <p className={styles.title}>选择支付方式</p> */}
                        <List>
                            <Item extra={Number(userInfo.ysJifen).toFixed(2)}>原始积分余额：</Item>
                            <Item extra={Number(userInfo.kyJifen).toFixed(2)}>可用积分余额：</Item>
                        </List>
                    </div>

                    {/* 选择支付方式 */}
                    <WhiteSpace size='xs    '></WhiteSpace>
                    <div className={styles.chooseType}>
                        <p className={styles.title}>选择支付方式</p>
                        <List>
                            <InputItem value='微信支付' editable={false} extra={<Checkbox checked={type===1} onChange={(e)=>this.chgType(e,1)} />} >
                                <img  className={styles.icon} src={wechat} alt=""/>
                            </InputItem>
                            <InputItem value='支付宝' editable={false} extra={<Checkbox checked={type===2}  onChange={(e)=>this.chgType(e,2)} />} >
                                <img  className={styles.icon} src={alipay} alt=""/>
                            </InputItem>
                            <InputItem value='余额' editable={false} extra={<Checkbox checked={type===3}  onChange={(e)=>this.chgType(e,3)} />} >
                                <img  className={styles.icon} src={yuepay} alt=""/>
                            </InputItem>

                        </List>
                    </div>
                    {/* 确认按钮 */}
                    <div className={styles.btnBox}>
                        <Button type='primary' disabled={disabled} loading={disabled} onClick={() => prompt(
                            '支付密码',
                            '请输入您的支付密码',
                            [
                                { text: '取消' },
                                { text: '提交', onPress: password => this.checkInfo(password)},
                            ],
                            'secure-text',
                            )}
                        >立即付款</Button>
                    </div>
                </div>
            </div>
        )
    }
}
