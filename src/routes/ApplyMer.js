import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/applyMer.less";
import { Button,Toast,List,InputItem,ImagePicker,Picker} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import options from '../components/AddrList';
import * as fetch from '../services/user';
import * as external from "../services/external";
const Item=List.Item;
@connect(state => ({userData: state.user}))
export default class ApplyMer extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            disabled:false,
            fileLogo:[],
            fileLicense:[],
            fileCardA:[],
            fileCardB:[],
            area:'',
            areaList:[],
          checked: true, dis: false, info: '',userArg:'',
        };
    }

    // 按钮的disabled属性更改
    chgDisabled(disabled){
        this.setState({disabled})
    }
    // 选择地址
    chgArea(area){
        if(area){
          if(area.length==2){
            this.setState({
              area:area[0]+area[1],
              areaList:area
            })
          }else{
            this.setState({
              area:area[0]+area[1]+area[2],
              areaList:area
            })
          }
        }
    }
    // 选择图片
    onChange = (files, type, index, mode) => {
        if(mode===0){
            this.setState({fileLicense:files},()=>{if(type==='remove'){return;};this.uploadImg(mode)});
        }else if(mode===1){
            this.setState({fileCardA:files},()=>{if(type==='remove'){return;};this.uploadImg(mode)});
        }else if(mode===2){
            this.setState({fileCardB:files},()=>{if(type==='remove'){return;};this.uploadImg(mode)});
        }else if(mode===3){
            this.setState({fileLogo:files},()=>{if(type==='remove'){return;};this.uploadImg(mode)});
        }
    }
    // 上传图片
    async uploadImg(mode){
        let {fileLogo,fileLicense,fileCardA,fileCardB}=this.state;
        let formData = new FormData();
        if(mode===0){
            formData.append("Filename",fileLicense[0].file.name);
            formData.append("imgFile",fileLicense[0].url);
        }else if(mode===1){
            formData.append("Filename",fileCardA[0].file.name);
            formData.append("imgFile",fileCardA[0].url);
        }else if(mode===2){
            formData.append("Filename",fileCardB[0].file.name);
            formData.append("imgFile",fileCardB[0].url);
        }else if(mode===3){
            formData.append("Filename",fileLogo[0].file.name);
            formData.append("imgFile",fileLogo[0].url);
        }
        const value=await fetch.uploadImg(formData)
        if(value.status){
            if(mode===0){
                fileLicense[0].realUrl=value.url;
                fileLicense[0].uploaded=true;
                this.setState({fileLicense})
            }else if(mode===1){
                fileCardA[0].realUrl=value.url;
                fileCardA[0].uploaded=true;
                this.setState({fileCardA})
            }else if(mode===2){
                fileCardB[0].realUrl=value.url;
                fileCardB[0].uploaded=true;
                this.setState({fileCardB})
            }else if(mode===3){
                fileLogo[0].realUrl=value.url;
                fileLogo[0].uploaded=true;
                this.setState({fileLogo})
            }
        }else{
            if(mode===0){
                this.setState({fileLicense:[]});
                Toast.fail('营业执照上传失败',2);
            }else if(mode===1){
                this.setState({fileCardA:[]});
                Toast.fail('身份证(正面)上传失败',2);
            }else if(mode===2){
                this.setState({fileCardB:[]});
                Toast.fail('身份证(反面)上传失败',2);
            }else if(mode===3){
                this.setState({fileLogo:[]});
                Toast.fail('商家头像上传失败',2);
            }
        }
    }


    // 提交申请
    async apply(){
      if(this.state.checked){
        Toast.offline('请同意阅读商家协议',1);
        return;
      }
        this.chgDisabled(true);
        const {dispatch,userData}=this.props;
        let _id=userData.user._id;
        const {area,areaList,fileLogo,fileLicense,fileCardA,fileCardB}=this.state;
        let merchant_name=this.merchant_name.state.value;
        let merchant_describe=this.merchant_describe.state.value;
        let merchant_mobile=this.merchant_mobile.state.value;
        let merchant_card=this.merchant_card.state.value;
        let merchant_address =this.merchant_address.state.value;
        if(merchant_name===''){Toast.offline('请填写商家名称',2);this.chgDisabled(false);return};
        if(merchant_describe===''){Toast.offline('请填写商家描述',2);this.chgDisabled(false);return};
        if(merchant_mobile===''){Toast.offline('请填写商家手机',2);this.chgDisabled(false);return};
        if(merchant_card===''){Toast.offline('请填写身份证号',2);this.chgDisabled(false);return}
        if(merchant_address===''){Toast.offline('请填写详细地址',2);this.chgDisabled(false);return};
        let sql={_id,merchant_name,merchant_describe,merchant_mobile,merchant_card,merchant_address};


        // 判断是否选择地址
        if(areaList.length===0){
            Toast.offline('请选择地址',2);
            this.chgDisabled(false);
            return;
        }else{
            sql.merchant_province=areaList[0];
            sql.merchant_city=areaList[1];
            if(areaList.length===3){
                sql.merchant_area=areaList[2];
            }
        };

        // 判断营业执照
        if(fileLicense.length!==0){
            if(fileLicense[0].uploaded){
                sql.merchant_businessLicense=fileLicense[0].realUrl;
            }else{
                Toast.offline('营业执照正在上传',2);
                this.chgDisabled(false);
                return;
            }
        }else{
            Toast.offline('请上传营业执照',2);
            this.chgDisabled(false);
            return;
        }

        // 判断身份证正面
        if(fileCardA.length!==0){
            if(fileCardA[0].uploaded){
                sql.merchant_cardUrl1=fileCardA[0].realUrl;
            }else{
                Toast.offline('身份证(正面)正在上传',2);
                this.chgDisabled(false);
                return;
            }
        }else{
            Toast.offline('请上传身份证(正面)',2);
            this.chgDisabled(false);
            return;
        }
        // 判断身份证反面
        if(fileCardB.length!==0){
            if(fileCardB[0].uploaded){
                sql.merchant_cardUrl2=fileCardB[0].realUrl;
            }else{
                Toast.offline('身份证(反面)正在上传',2);
                this.chgDisabled(false);
                return;
            }
        }else{
            Toast.offline('请上传身份证(反面)',2);
            this.chgDisabled(false);
            return;
        }

         // 判断商家头像
         if(fileLogo.length!==0){
            if(fileLogo[0].uploaded){
                sql.merchant_logo=fileLogo[0].realUrl;
            }else{
                Toast.offline('商家头像正在上传',2);
                this.chgDisabled(false);
                return;
            }
        }else{
            Toast.offline('请上传商家头像',2);
            this.chgDisabled(false);
            return;
        }

        const value=await fetch.applyMer(sql);
        if(value.status){
            Toast.success('申请成功,等待审核',2,()=>{
                dispatch(routerRedux.push('/mine'))
            });
        }else{
            Toast.fail(value.message,2);
            this.chgDisabled(false);
        }

    }
  async componentDidMount() {
    const data = await external.xieyi();
    this.setState({userArg: data.resource.merchantAgreement})
  }
    render() {
        const {history,dispatch}=this.props;
        const {disabled,area,fileLogo,fileLicense,fileCardA,fileCardB}=this.state;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'申请入驻',
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

                <div className={styles.main}>
                    <List className={styles.list}>
                        <p className={styles.title}>商家头像：</p>
                            <Item
                                extra={
                                    <ImagePicker
                                    length={1}
                                    files={fileLogo}
                                    onChange={(files, type, index)=>this.onChange(files,type,index,3)}
                                    selectable={fileLogo.length<1}
                                    />
                        }
                        />
                        <p className={styles.title}>商家名称：</p>
                        <InputItem type='text' placeholder='' ref={el=>this.merchant_name=el} />
                        <p className={styles.title}>商家描述：</p>
                        <InputItem type='text' placeholder='' ref={el=>this.merchant_describe=el} />
                        <p className={styles.title}>手机号码：</p>
                        <InputItem type='number' maxLength={11} placeholder='' ref={el=>this.merchant_mobile=el} />
                        <p className={styles.title}>身份证号：</p>
                        <InputItem type='text' maxLength={18} placeholder='' ref={el=>this.merchant_card=el} />
                        <p className={styles.title}>商家地址：</p>
                        <Picker

                            extra=' '
                            data={options}
                            onOk={e => this.chgArea(e)}
                            onDismiss={e => this.chgArea(e)}
                            ref={el=>this.picker=el}
                        >
                            <InputItem className='addrpicker' value={area} editable={false} type='text' placeholder=''/>
                        </Picker>
                        <p className={styles.title}>详细地址：</p>
                        <InputItem type='text' placeholder='' ref={el=>this.merchant_address=el} />
                        <p className={styles.title}>营业执照：</p>
                        <Item
                        extra={
                            <ImagePicker
                            length={1}
                            files={fileLicense}
                            onChange={(files, type, index)=>this.onChange(files,type,index,0)}
                            selectable={fileLicense.length<1}
                            />
                        }
                        />
                        <p className={styles.title}>身份证(正面)：</p>
                        <Item
                        extra={
                            <ImagePicker
                            length={1}
                            files={fileCardA}
                            onChange={(files, type, index)=>this.onChange(files,type,index,1)}
                            selectable={fileCardA.length<1}
                            />
                        }
                        />
                        <p className={styles.title}>身份证(背面)：</p>
                        <Item
                        extra={
                            <ImagePicker
                            length={1}
                            files={fileCardB}
                            onChange={(files, type, index)=>this.onChange(files,type,index,2)}
                            selectable={fileCardB.length<1}
                            />
                        }
                        />
                    </List>
                  {/*xieyi*/}
                  <div className={styles.xieyi}>
                            <span className={styles.Xyuan}
                                  onClick={() => this.setState({checked: !this.state.checked})}
                                  style={{background: (this.state.checked ? '#fff' : '')}}
                            ></span>
                    <div className={styles.posMark} style={{display: (this.state.dis ? 'block' : 'none')}}>
                      <p onClick={() => this.setState({dis: !this.state.dis})}><img
                        src={require('../assets/icon/delicon.png')} alt=""/></p>
                      <h5>用户协议</h5>
                      <div>
                        {this.state.userArg}
                      </div>
                    </div>
                    <span className={styles.hov} onClick={() => this.setState({dis: !this.state.dis})}>我已阅读并同意《商家协议》</span>
                  </div>
                    <div className={styles.btnBox}>
                        <Button type='primary' disabled={disabled} loading={disabled} onClick={()=>this.apply()} >确认提交</Button>`
                    </div>
                </div>
            </div>
        )
    }
}
