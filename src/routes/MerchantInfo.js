import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/merchantInfo.less";
import { Button,Toast,List,InputItem,ImagePicker} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import person from '../assets/icon/person.jpg';
const Item=List.Item;
@connect(state => ({userData: state.user}))
export default class MerchantInfo extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            disabled:false,
            edit:false,
            files:[]
        };
    }
    componentWillMount(){
        const merchant=this.props.userData.merchant;
        if(merchant.merchant_logo){
            if(merchant.merchant_logo===''){return};
            this.setState({
                files:[{
                url:APIHost+merchant.merchant_logo,
                realUrl:merchant.merchant_logo
                }]
            })
        }
    }

    componentWillReceiveProps(nextProps){
        const merchant=nextProps.userData.merchant;
        if(merchant.merchant_logo){
            if(merchant.merchant_logo===''){return};
            this.setState({
                files:[{
                url:APIHost+merchant.merchant_logo,
                realUrl:merchant.merchant_logo
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
        const value=await fetch.uploadImg(formData)
        if(value.status){
            files[0].realUrl=value.url;
            this.setState({files})
        }else{
            this.setState({files:[]});
            Toast.fail('头像上传失败',2);
        }
    }

    // 提交
    async apply(){
        this.chgDisabled(true);
        const {dispatch,userData}=this.props;
        const {files}=this.state;
        let _id=userData.merchant.userId;

        let merchant_name =this.merchant_name.state.value;
        let merchant_describe =this.merchant_describe.state.value;
        let outLineFanLiRate =this.outLineFanLiRate.state.value;
        let merchant_mobile =this.merchant_mobile.state.value;
        if(!_id){Toast.offline('获取商家信息失败,请刷新重试!',2);this.chgDisabled(false);return};
        if(merchant_name===''){Toast.offline('商家姓名不可为空',2);this.chgDisabled(false);return};
        if(merchant_describe===''){Toast.offline('商家描述不可为空',2);this.chgDisabled(false);return};
        if(outLineFanLiRate===''){Toast.offline('商家返利比不可为空',2);this.chgDisabled(false);return};
        if(merchant_mobile===''){Toast.offline('商家联系方式不可为空',2);this.chgDisabled(false);return};



        if(files.length===0){Toast.offline('请上传您的头像',2);this.chgDisabled(false);return};
        if(!files[0].realUrl){Toast.offline('头像上传中',2);this.chgDisabled(false);return};
        outLineFanLiRate=Number(outLineFanLiRate)/100;
        let sql={_id,merchat:{merchant_logo:files[0].realUrl,merchant_name,merchant_describe,outLineFanLiRate,merchant_mobile}};
        const value=await fetch.updateMerchant(sql);
        if(value.status){
            Toast.success('修改成功',2,()=>{
               this.setState({
                   edit:false
               },()=>{
                   this.chgDisabled(false);
                   dispatch({
                       type:'user/getMerchant'
                   })
               })
            });
        }else{
            Toast.fail(value.message,2);
            this.chgDisabled(false);
        }

    }
    render() {
        const {history,dispatch,userData}=this.props;
        let merchant=userData.merchant;
        const {files,disabled,edit}=this.state;
        const _this=this;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                if(edit){
                    _this.setState({
                        edit:false
                    })
                }else{
                    dispatch(routerRedux.goBack())
                }

            },
            titleName:edit?'店铺设置':'店铺信息',
            rightContent:edit?'':'编辑',
            rightFunc(){
                if(!edit){
                    _this.setState({
                        edit:true
                    })
                }
            }

        }
        return (
            <div className={styles.rootBox}>
                <style>
                    {`
                        .am-list-item{
                            min-height:124px !important;
                        }
                        .am-list-content{
                            color:#666666 !important;
                        }
                        .am-input-label{
                            color:#666666 !important;
                        }
                        .am-list-item .am-input-control input{
                            color:#666666 !important;
                            text-align: right !important;
                        }
                        .am-flexbox-align-center .am-flexbox-item:not(:first-child){
                            display: none;
                        }
                    `}
                </style>
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>
                <div className={styles.main}>
                    {
                        merchant._id?
                        <List>
                            <Item extra={
                                edit?<ImagePicker
                                        length={1}
                                        files={files}
                                        onChange={(files, type, index)=>this.onChange(files,type,index)}
                                        selectable={files.length<1}
                                    />:
                                    <div className={styles.headImgBox}><img src={APIHost+merchant.merchant_logo} alt='' /></div>
                            }>店铺头像：</Item>
                            <InputItem type='text' defaultValue={merchant.merchant_name} ref={el=>this.merchant_name=el} editable={edit} >商家名称：</InputItem>
                            <InputItem type='text' defaultValue={merchant.merchant_describe} ref={el=>this.merchant_describe=el} editable={edit} >商家描述：</InputItem>
                            <InputItem type='number' defaultValue={merchant.outLineFanLiRate} ref={el=>this.outLineFanLiRate=el} editable={edit} >返利比：</InputItem>
                            <InputItem type='number' maxLength={11} defaultValue={merchant.merchant_mobile} ref={el=>this.merchant_mobile=el} editable={edit} >联系方式：</InputItem>
                        </List>
                        :
                        ''

                    }

                    <div style={{'visibility':edit?'visible':'hidden'}} className={styles.btnBox}>
                        <Button type='primary' disabled={disabled} loading={disabled} onClick={()=>this.apply()} >确认修改</Button>
                    </div>
                </div>
            </div>
        )
    }
}
