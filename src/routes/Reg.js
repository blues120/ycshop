import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import styles from "./styles/reg.less";
import { Button,Picker,Toast,List,InputItem,Icon} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as external from '../services/external';
import options from "../components/AddrList";
import * as fetch from "../services/user";
var queryString = require('querystring');
@connect(state => ({userData: state.user}))
export default class Reg extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            activeItem:1,
            disabled:false,
            codeExtra:'获取验证码',
            parentUsername:'',
          checked: true, dis: false,info:'',
          userArg:'',
          edit:false,
          area:'点击选择地址',
          isDefault:false,
          areaList:[],
          _id:''
        };
    }
    componentWillMount(){
        const {location,dispatch}=this.props;
        location.search=location.search.replace('?','')
        const parsed = queryString.parse(location.search);
        if(parsed.parentUsername){
            this.setState({
                parentUsername:parsed.parentUsername,

            })
        }
    }
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
   async componentDidMount(){
      const data=await external.xieyi();
      this.setState({userArg:data.resource.userAgreement})
   }
    // 按钮的disabled属性更改
    chgDisabled(disabled){
        this.setState({disabled})
    }

    // 更改注册步骤
    chgActive(activeItem){
        this.setState({activeItem})
    }
    // 获取验证码
    async GetCode(){
        if (this.state.codeExtra!=="获取验证码") {
            return;
        }
        const mobile=this.mobile.state.value;
          if (mobile.length!==11) {
            Toast.fail("手机格式错误",2)
            return;
          }
          const value =await external.getRegCode({mobile});
          if (value.status) {
            Toast.success("获取成功",2)
          }else{
            Toast.fail(value.message,2)
          }
          const _this=this;
          let num=120;
          let Countdown=setInterval(function(){
              num=num-1;
              if (num>=0) {
                _this.setState({codeExtra:num+""});
                return;
              }
              _this.setState({codeExtra:'获取验证码'});
              clearInterval(Countdown);
          },1000)
    }

    // 按钮点击
    btnTap(){
      if(this.state.checked){
        Toast.offline('请同意阅读用户协议',1);
        return;
      }
        const {dispatch}=this.props;
        const {activeItem}=this.state;
      if(activeItem===1){
            this.checkCode();
        }else if(activeItem===2){
        this.goReg();
        }else if(activeItem===3){
            dispatch(routerRedux.push('/login'))
        }
    }
    // 检查手机号和验证码
    checkCode(){
        let mobile=this.mobile.state.value;
        let VerificationCode=this.VerificationCode.state.value;
        let testMobile=new RegExp(/^1[0-9]{10}$/);
        if(!testMobile.test(mobile)){
            Toast.offline('手机号码格式不正确',2);
            return;
        }
        if(VerificationCode.length!==6){
            Toast.offline('验证码应为6位',2);
            return;
        }
        this.setState({
            activeItem:2,
        })
    }
    // 注册
    async goReg(){
      let reg=/^\d+$/;
      const {areaList} =this.state;
      this.chgDisabled(true);
        let mobile=this.mobile.state.value;
        let VerificationCode=this.VerificationCode.state.value;
        let name=this.name.state.value;
        let password=this.password.state.value;
        let tranpwd=this.secondpwd.state.value;
        let parentUsername=this.parentUsername.state.value;
      console.log(tranpwd);
      let username=mobile;
        if(name===''){Toast.offline('请输入您的真实姓名',2);this.chgDisabled(false);return;}
        if(password===''){Toast.offline('请输入您的登录密码',2);this.chgDisabled(false);return;}
        if(tranpwd===''){Toast.offline('请输入您的支付密码',2);this.chgDisabled(false);return;}
      if(!reg.test(tranpwd)){Toast.offline('请输入数字',2);this.chgDisabled(false);return;}
        let sql={mobile,VerificationCode,name,username,password,tranpwd};
        if(parentUsername.length!==0){
            sql.parentUsername=parentUsername;
        }
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
        const value=await external.register(sql);
        this.chgDisabled(false);
        if(value.status){
            this.setState({
                activeItem:3,
            })
        }else{
            Toast.fail(value.message,2,()=>{
                this.setState({
                    activeItem:1,
                })
            });

        }

    }
  async handleClickRead(){
    this.setState({dis:!this.state.dis});

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
      const {history,dispatch}=this.props;
        const {activeItem,disabled,codeExtra,parentUsername,area,areaList,edit,isDefault}=this.state;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'注册',
        }
        return (
            <div className={styles.rootBox}>
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>
                <div className={styles.main}>
                    {/* 注册导航 */}
                    <div className={styles.topMenu}>
                        <div className={activeItem===1?styles.active:''}><span>1</span>获取验证码</div>
                        <div className={activeItem===2?styles.active:''}><span>2</span>完善帐号信息</div>
                        <div className={activeItem===3?styles.active:''}><span>3</span>完成注册</div>
                    </div>
                {/* 主体区域 */}
                    <div className={styles.itemList}>
                        {/* 第一部分验证手机号 */}
                        <List className={activeItem===1?styles.show:''}>
                            <p className={styles.inputTitle}>手机号码</p>
                            <InputItem type='number' maxLength={11} placeholder='请输入手机号' ref={el=>this.mobile=el} />
                            <p className={styles.inputTitle}>验证码</p>
                            <InputItem type='number' maxLength={6} placeholder='请输入验证码' extra={codeExtra} onExtraClick={()=>this.GetCode()} ref={el=>this.VerificationCode=el} />
                          <div className={styles.xieyi}>
                            <span className={styles.Xyuan}
                                  onClick={() => this.setState({checked: !this.state.checked})}
                                  style={{background: (this.state.checked ? '#fff' : '')}}
                            ></span>
                            <span className={styles.hov} onClick={()=>this.setState({dis:!this.state.dis})}>我已阅读并同意《用户协议》</span>
                          </div>
                          <div className={styles.posMark} style={{display: (this.state.dis ? 'block' : 'none')}}>
                            <p onClick={() => this.setState({dis: !this.state.dis})}><img
                              src={require('../assets/icon/delicon.png')} alt=""/></p>
                            <h5>用户协议</h5>
                            <div>
                              {this.state.userArg}
                            </div>
                          </div>
                        </List>
                        {/* 第二部分完善信息*/}
                        <List className={activeItem===2?styles.show:''}>
                            <p className={styles.inputTitle}>姓名</p>
                            <InputItem type='text' placeholder='请输入您的真实姓名' ref={el=>this.name=el} />
                            <p className={styles.inputTitle}>登录密码</p>
                            <InputItem type='password' placeholder='请输入登录密码' ref={el=>this.password=el} />
                            <p className={styles.inputTitle}>交易密码</p>
                            <InputItem type='password' placeholder='请输入交易密码' ref={el=>this.secondpwd=el} />
                            <p className={styles.inputTitle}>推荐人</p>
                            <InputItem type='number' defaultValue={parentUsername} editable={parentUsername===''} maxLength={11} placeholder='请输入推荐人手机(非必填)' ref={el=>this.parentUsername=el} />
                          <p className={styles.inputTitle}>区域</p>
                          <Picker
                            value={areaList}
                            extra={false}
                            data={options}
                            onOk={e => this.chgArea(e)}
                            onDismiss={e => this.chgArea(e)}
                            ref={el=>this.picker=el}
                          >
                            <InputItem className='addrpicker' value={area} editable={false} type='text'  />
                          </Picker>
                        </List>
                      {/*ccc*/}

                        {/* 第三部分完成注册 */}
                        <div className={activeItem===3?styles.show:''}>
                            <p className={styles.end}><Icon size='sm' color='#F33752' type='check-circle'></Icon><span>完成注册</span></p>
                        </div>
                        {/* 按钮 */}
                        <div className={styles.btnBox}>
                            <div className={activeItem===2?styles.show:styles.hide}><Button type='primary' size='small' disabled={disabled} loading={disabled} onClick={()=>this.chgActive(1)} >上一步</Button></div>
                            <div><Button type='primary' size='small' disabled={disabled} loading={disabled} onClick={()=>this.btnTap()} >{activeItem===1?'下一步':activeItem===2?'确定':'立即登陆'}</Button></div>
                        </div>

                    </div>

                </div>
            </div>
        )
    }
}
