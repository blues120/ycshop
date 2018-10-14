import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/review.less";
import { Button,Toast,List,TextareaItem,ImagePicker} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import * as userFetch from '../services/user';
let queryString = require('querystring');
@connect(state => ({shopData: state.shop}))
export default class Review extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            disabled:false,
            files:[],
          headImg:'',
          Message:''
        };
    }

    async componentDidMount(){
        const {dispatch,location}=this.props;
        location.search=location.search.replace("?","");
        const parsed = queryString.parse(location.search);
        if(parsed.index){
          console.log(parsed.index,'@@@');
          const Data=await fetch.xiuGai(parsed.index);
          console.log(Data,'cccccccccc');
          let Message=Data.resource.message?Data.resource.message:'';
          // let headImg=Data.resource.headImg?Data.resource.headImg:'';
          this.message.state.value=Message;
          var newArr = [];
          Data.resource.imgs.map(function (item,index) {
            newArr.push({
              url: APIHost+item,
              realUrl: item

            });
          })
          console.log(newArr,'aaaaaaa');
          this.setState({files:newArr});

          // this.setState({Message,headImg})
          return;
        }else if(parsed.orderId&&parsed.goodId){
            this.setState({orderId:parsed.orderId,goodId:parsed.goodId})
        }else{
            Toast.offline('订单信息错误请重试',2,()=>{
                dispatch(routerRedux.push('/myorder'))
            })
        }
    }

    // 按钮的disabled属性更改
    chgDisabled(disabled){
        this.setState({disabled})
    }
    // 选择图片
    onChange = (files, type, index) => {

        this.setState({files},()=>{
            if(type==='remove'){
                return
            }
            this.uploadImg()});
    }
    // 上传图片
    async uploadImg(){
        let {files}=this.state;
        let formData = new FormData();
        formData.append("Filename",files[files.length-1].file.name);
        formData.append("imgFile",files[files.length-1].url);
        const value=await userFetch.uploadImg(formData)
        if(value.status){
            files[files.length-1].realUrl=value.url;
          console.log('cwt',files);
          this.setState({files})
        }else{
            files.pop();
            this.setState({files});
            Toast.fail('图片上传失败',2);
        }
    }

    // 提交申请
    async apply(){
      const {dispatch,shopData,location,history}=this.props;
      const {files,orderId,goodId}=this.state;
      location.search=location.search.replace("?","");
      const parsed = queryString.parse(location.search);
      if(parsed.index){
        console.log(this.refs,'cccc@!');
        console.log(this.message.state.value,'@!!!!!!!!!!!!!!!!!!');
        let imgs=[];
        if(files.length>0){
          files.map(i=>{
            imgs.push(i.realUrl);
          })
        }
        const info=await fetch.XIUGAI({id:parsed.index,message:this.message.state.value,imgs:imgs});
      info.status?Toast.success(info.message,2,()=>history.goBack()):Toast.offline(info.message,2);
        console.log(info,'xxxx');
        return;
      }


        this.chgDisabled(true);
        let orderInfo=shopData.orderInfo;


        let message =this.message.state.value;
        if(message ===''){Toast.offline('评价不可为空',2);this.chgDisabled(false);return};

        let guige='';
        if(orderInfo.goodsList.length===0){
            Toast.offline('获取订单信息失败,请刷新',2);
            this.chgDisabled(false);
            return;
        }
        orderInfo.goodsList.map((i,index)=>{
            if(i.id===goodId){
                guige=i.guigeText.propertyCombination
            }
        })
        let imgs=[];
        if(files.length>0){
            files.map(i=>{
                imgs.push(i.realUrl);
            })
        }
        let sql={message,orderId,goodId,imgs,guige};
        const value=await fetch.addReview(sql);
        if(value.status){
            Toast.success('评论成功',2,()=>{
                dispatch(routerRedux.goBack())
            });
        }else{
            Toast.fail(value.message,2);
            this.chgDisabled(false);
        }

    }


    render() {
        const {history,dispatch,shopData}=this.props;
        let goodDetail=shopData.goodDetail;
        const {disabled,files,Message,headImg} =this.state;
      console.log(this.state.Message,'11111111111111111111111111111');

      console.log(Message,'wwwwwwww');
      // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'发表评价',
        }
        return (
            <div className={styles.rootBox}>
                <style>
                    {`
                        .am-image-picker-list{
                            padding: .2rem !important;
                        }
                        .am-list-body::after{
                            visibility:hidden;
                        }
                    `}
                </style>
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    <div className={styles.title}>
                        <img src={APIHost+goodDetail.cover} alt=""/>
                        <span>{goodDetail.name}</span>
                    </div>
                    <List>
                        <TextareaItem
                            rows={5}
                            defaultValue={this.state.Message}
                            ref={el=>this.message=el}


                        />
                    </List>
                    {/* 上传图片区 */}
                    <div className={styles.imgBox}>
                        <ImagePicker
                            length={1}
                            files={files}
                            onChange={(files, type, index)=>this.onChange(files,type,index)}
                            selectable={files.length<3}
                            ref='pick'
                        />
                    </div>
                    {/* 确认按钮 */}
                    <div className={styles.btnBox}>
                        <Button type='primary' disabled={disabled} loading={disabled} onClick={()=>this.apply()} >发布评价</Button>
                    </div>
                </div>
            </div>
        )
    }
}
