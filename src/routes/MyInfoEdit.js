import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/applyMer.less";
import { Button,Toast,List,InputItem,ImagePicker,Picker} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import options from '../components/AddrList';
import * as fetch from '../services/user';
import history from 'history/createBrowserHistory';
const Item=List.Item;
@connect(state => ({userData: state.user}))
export default class MyInfoEdit extends Component {
    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            files:[],
            disabled:false
        };
    }


    componentWillMount(){
        const userInfo=this.props.userData.user;
        if(userInfo.headerImg){
            if(userInfo.headerImg===''){return};
            this.setState({
                files:[{
                url:APIHost+userInfo.headerImg,
                realUrl:userInfo.headerImg
                }]
            })
        }
    }
    componentWillReceiveProps(nextProps){
    const userInfo=nextProps.userData.user;
    if(userInfo.headerImg){
        if(userInfo.headerImg===''){return};
        this.setState({
            files:[{
            url:APIHost+userInfo.headerImg,
            realUrl:userInfo.headerImg
            }]
        })
    }
    }


    // 按钮的disabled属性更改
    chgDisabled(disabled){
        this.setState({disabled})
    }
    // 选择图片
    onChange = (files, type, index) => {
        this.setState({files},()=>{if(type==='remove'){return;};this.uploadImg()});
    }
    // 上传图片
    async uploadImg(){
        let {files}=this.state;
        let formData = new FormData();
        formData.append("Filename",files[0].file.name);
        formData.append("imgFile",files[0].url);
        const value=await fetch.uploadImg(formData);
        if(value.status){
            files[0].realUrl=value.url;
            this.setState({files})
        }else{
            this.setState({files:[]});
            Toast.fail('头像上传失败',2);
        }
    }


    // 提交申请
    async apply(){
        this.chgDisabled(true);
        const {dispatch,userData}=this.props;
        const {files}=this.state;
        let name =this.name .state.value;
        if(name ===''){Toast.offline('您的名字',2);this.chgDisabled(false);return};
        if(files.length===0){Toast.offline('请上传您的头像',2);this.chgDisabled(false);return};
        if(!files[0].realUrl){Toast.offline('头像上传中',2);this.chgDisabled(false);return};
        let sql={name,headerImg:files[0].realUrl}
        const value=await fetch.userEdit(sql);
        if(value.status){
            Toast.success('修改成功',2,()=>{
                dispatch(routerRedux.push('/mine'))
            });
        }else{
            Toast.fail(value.message,2);
            this.chgDisabled(false);
        }

    }
    render() {
        const {history,dispatch,userData}=this.props;
        let userInfo=userData.user;
        const {disabled,area,files}=this.state;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'个人信息修改',
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
                        }
                        .am-flexbox-align-center .am-flexbox-item:not(:first-child){
                            display: none;
                        }
                        .addrpicker .am-input-extra{
                            visibility: hidden;
                        }
                    `}
                </style>
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>
                {
                    userInfo._id?
                    <div className={styles.main}>
                        <List className={styles.list}>
                            <p className={styles.title}>头像更改：</p>
                            <Item
                                extra={
                                    <ImagePicker
                                        length={1}
                                        files={files}
                                        onChange={(files, type, index)=>this.onChange(files,type,index)}
                                        selectable={files.length<1}
                                    />
                                }
                            />
                            <p className={styles.title}>用户姓名：</p>
                            <InputItem type='text' placeholder='' defaultValue={userInfo.name} ref={el=>this.name=el} />
                        </List>
                        <div className={styles.btnBox}>

                          <Button type='primary' disabled={disabled} loading={disabled} onClick={()=>this.apply()} >确认提交</Button>
                          <Button style={{marginTop:'.3rem'}} type='primary' onClick={()=>history.push('/chgpwd')}>修改密码</Button>
                        </div>
                    </div>
                    :
                    ''
                }

            </div>
        )
    }
}
