import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/bankCardEdit.less";
import { Button,Toast,List,InputItem} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
@connect(state => ({userData: state.user}))
export default class BankCardEdit extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            disabled:false
        };
    }

    // 按钮的disabled属性更改
    chgDisabled(disabled){
        this.setState({disabled})
    }
    // 添加银行卡
    async addCard(){
        this.chgDisabled(true);
        const {dispatch}=this.props;
        let cardholder=this.cardholder.state.value;
        let cardNumber=this.cardNumber.state.value;
        if(cardholder===''){Toast.offline('请填写持卡人',2);this.chgDisabled(false);return};
        if(cardNumber===''){Toast.offline('请填写卡号',2);this.chgDisabled(false);return};
        const value= await fetch.addCard({cardholder,cardNumber});
        if(value.status){
            Toast.success('添加成功!',2);
            dispatch(routerRedux.goBack());
        }else{
            Toast.fail(value.message,2);
            this.chgDisabled(false);
        }
    }

    render() {
        const {history,dispatch}=this.props;
        const {disabled}=this.state;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'银行卡添加',
        }
        
        return (
            <div className={styles.rootBox}>
                
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    <List>
                        <InputItem type='text' placeholder='请输入持卡人' ref={el=>this.cardholder=el} ></InputItem>
                        <InputItem type='number' placeholder='请输入银行卡号' ref={el=>this.cardNumber=el} ></InputItem>
                    </List>
                    <div className={styles.btnBox}>
                        <Button type='primary'  disabled={disabled} loading={disabled}  onClick={()=>this.addCard()} >确认</Button>
                    </div>
                </div>
            </div>
        )
    }
}
