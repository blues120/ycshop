import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/myAddr.less";
import { Button,Toast,Checkbox,Modal} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import delateIcon from '../assets/icon/delate.png';
import editIcon from '../assets/icon/edit.png';
const alert=Modal.alert;
var queryString = require('querystring');
@connect(state => ({userData: state.user}))
export default class MyAddr extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            type:0,
          index:''
        };
    }
    //
    componentWillMount(){
        const {location}=this.props;
        location.search=location.search.replace("?","");
        const parsed = queryString.parse(location.search);
        if(parsed.type){
            this.setState({
                type:1
            })
        }if(parsed.index){
        this.setState({
          index:1
        })
      }
    } 
    
    // 选择地址
    selectAddr(_id){
        const {type,index}=this.state;
        const {dispatch}=this.props;
        if(type===1){
          if(index===1){
            dispatch(routerRedux.push('/cop?addrid='+_id));
            return;
          }
            dispatch(routerRedux.push('/confirmorder?addrid='+_id));
        }
    }
    // 删除地址
    async deleteAddr(_id,index){
        const {dispatch}=this.props;
        const value=await fetch.deteteAddr({_id});
        if(value.status){
            Toast.success('删除成功!',2);
            dispatch({
                type:'user/deleteAddr',
                payload:{
                    index
                }
            })
        }else{
            Toast.fail(value.message,2);
        }
    }
    // 设置默认地址
    async setDefault(e,index,i){
        Toast.loading('设置中!',0);
        const {dispatch}=this.props;
        let isDefault=e.target.checked;
        let sql={_id:i._id,isDefault};
        let value=value=await fetch.defaultAddr(sql);
        if(value.status){
            Toast.success('修改成功',2);
            dispatch({
                type:'user/defaultAddr',
                payload:{
                    isDefault,
                    index,
                    _id:i._id
                }
            })
        }else{
            Toast.fail(value.message,2);
        }

    }
    render() {
        const {history,dispatch,userData}=this.props;
        const addrList=userData.addrList;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:"我的地址",
            rightContent:'添加地址',
            rightFunc(){
                dispatch(routerRedux.push('/myaddredit'))
            },
        }
        
        return (
            <div className={styles.rootBox}>
                
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    {/* 地址子项 */}
                    {
                        addrList.map((i,index)=>{
                            return(
                                <div key={index} className={styles.addrItem} onClick={()=>this.selectAddr(i._id)}>
                                    <div className={styles.info}>
                                        <p className={styles.title}>{i.province+i.city}  <span>{i.recipient}</span> <span>{i.telephone}</span></p>
                                        <p className={styles.addr}>{i.area+i.address}</p>
                                    </div>

                                    <div className={styles.edit}>
                                        <Checkbox checked={i.isDefault} onChange={e=>this.setDefault(e,index,i)} className={styles.editL}><span className={styles.label}>设为默认</span></Checkbox>
                                        <div className={styles.editR}>
                                            <div onClick={()=>history.push('/myaddredit?_id='+i._id)}>
                                                <img src={editIcon} alt=""/>
                                                <span>编辑</span>
                                            </div>
                                            <div 
                                                onClick={
                                                    ()=>alert('删除警告', '确定删除地址吗,本操作无法撤销!', [
                                                        { text: '取消',},
                                                        { text: '确定', onPress: () => this.deleteAddr(i._id,index)},
                                                    ])
                                                }>
                                                <img src={delateIcon} alt=""/>
                                                <span>删除</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    
                </div>
            </div>
        )
    }
}
