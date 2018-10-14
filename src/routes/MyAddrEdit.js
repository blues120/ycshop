import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import styles from "./styles/myAddrEdit.less";
import { Button,Toast,List,InputItem,Picker,Checkbox} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import options from '../components/AddrList';
import * as fetch from '../services/user';
var queryString = require('querystring');
@connect(state => ({userData:state.user}))
export default class MyAddrEdit extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            edit:false,
            disabled:false,
            area:'点击选择地址',
            isDefault:false,
            areaList:[],
            _id:''
        };
    }


    componentWillMount(){
        const {location}=this.props;
        location.search=location.search.replace("?","")
        const parsed = queryString.parse(location.search);
        if(parsed._id){
            this.setState({
                edit:true
            })
        }else{
            this.setState({
                edit:false
            })
        }
    }
    componentWillReceiveProps(nextProps){
        const {history,dispatch,userData}=nextProps;
        const {edit}=this.state;
        let addrDetail=userData.addrDetail;
        if(edit&&addrDetail._id){
            let defaultArea=[];
            defaultArea.push(addrDetail.province);
            defaultArea.push(addrDetail.city);
            defaultArea.push(addrDetail.area);
            this.setState({
                area:defaultArea[0]+defaultArea[1]+defaultArea[2],
                areaList:defaultArea,
                isDefault:addrDetail.isDefault,
                _id:addrDetail._id
            })
        }
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
    chgChecked(e){
        this.setState({
            isDefault:e.target.checked
        })
    }

    // 提交地址
    async submitAddr(){
        this.chgDisabled(true);
        const {dispatch} =this.props;
        const {areaList,isDefault,edit,_id} =this.state;
        let recipient=this.recipient.state.value;
        let telephone=this.telephone.state.value;
        let address=this.address.state.value;
        if(recipient===''){Toast.offline('请填写收货人',2);this.chgDisabled(false);return};
        if(telephone===''){Toast.offline('请填写收货电话',2);this.chgDisabled(false);return};
        if(address===''){Toast.offline('请填写详细地址',2);this.chgDisabled(false);return};
        let sql={recipient,telephone,address};
        // 判断是否选择地址
        if(areaList.length===0){
            Toast.offline('请选择地址',2);
            this.chgDisabled(false);
            return;
        }else{
            sql.province =areaList[0];
            sql.city=areaList[1];
            if(areaList.length===3&&areaList[2]!==''){
                sql.area=areaList[2];
            }
        };
        if(isDefault){
            sql.isDefault=true;
        }
        let value;
        if(edit){
            sql._id=_id;
            value=await fetch.editAddr(sql);
        }else{
            value=await fetch.addAddr(sql);
        }
        if(value.status){
            Toast.success('成功',2);
            dispatch(routerRedux.goBack())
        }else{
            Toast.fail(value.message,2);
            this.chgDisabled(true);
        }
    }

    render() {
        const {history,dispatch,userData,location}=this.props;
        location.search=location.search.replace("?","")
        const parsed = queryString.parse(location.search);


        const {area,areaList,disabled,edit,isDefault}=this.state;
        let addrDetail=userData.addrDetail;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:"地址编辑",
        }

        return (
            <div className={styles.rootBox}>
                <style>
                    {`
                        .addrpicker .am-input-extra{
                            visibility: hidden;
                        }
                    `}
                </style>
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>

                <div className={styles.main}>
                    {
                        !parsed._id||addrDetail._id===parsed._id?
                        <List>
                            <InputItem type='text' defaultValue={edit?addrDetail.recipient:''} placeholder='请输入收货人' ref={el=>this.recipient=el} ></InputItem>
                            <InputItem type='number' defaultValue={edit?addrDetail.telephone:''} maxLength={11} placeholder='请输入手机号码' ref={el=>this.telephone=el} ></InputItem>
                            <Picker
                                value={areaList}
                                extra=''
                                data={options}
                                onOk={e => this.chgArea(e)}
                                onDismiss={e => this.chgArea(e)}
                                ref={el=>this.picker=el}
                            >
                                <InputItem className='addrpicker' value={area} editable={false} type='text' placeholder=''/>
                            </Picker>
                            <InputItem type='text' defaultValue={edit?addrDetail.address:''} placeholder='请输入详细地址' ref={el=>this.address=el} ></InputItem>
                            <InputItem type='text' value='默认' editable={false} extra={<Checkbox defaultChecked={parsed._id?addrDetail.isDefault:false} onChange={(e)=>this.chgChecked(e)} />} ></InputItem>
                        </List>
                        :
                        ''
                    }
                    <div className={styles.btnBox}>
                        <Button type='primary' disabled={disabled} loading={disabled} onClick={()=>this.submitAddr()} >确认</Button>
                    </div>
                </div>
            </div>
        )
    }
}
