import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/applyMer.less";
import {Button, Toast, List, InputItem, ImagePicker, Picker, ActionSheet} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import options from '../components/AddrList';
import oPtions from '../components/oPtions';
import * as fetch from '../services/user';
import * as external from "../services/external";

const Item = List.Item;
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
@connect(state => ({userData: state.user}))
export default class ApplyAgent extends Component {
  // disabled,area,filePhoto,fileCardA,fileCardB
  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      filePhoto: [],
      disabled: false,
      fileCardA: [],
      fileCardB: [],
      area: '',
      areaList: [],
      agent_type: 0,
      checked: true, dis: false, info: '',userArg:'',
    };
  }

  // 按钮的disabled属性更改
  chgDisabled(disabled) {
    this.setState({disabled})
  }

  // 选择代理类型
  showActionSheet = () => {
    const {dispatch, userData} = this.props;
    const cardList = userData.cardList;
    let BUTTONS = ['区域代理', '总代理', '取消'];

    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        title: '选择您的代理级别',
        maskClosable: false,
        'data-seed': 'logId',
        wrapProps,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          this.setState({
            agent_type: 1,
            area: ''
          });
        } else if (buttonIndex === 1) {
          this.setState({
            agent_type: 2
            , area: ''
          })
        }
      });
  }

  // 选择地址
  chgArea(area) {


    if (area) {
      if (area.length === 1) {
        this.setState({area: area, areaList: area});
        return;
      }
      if (area.length == 2) {
        this.setState({
          area: area[0] + area[1],
          areaList: area
        })
      } else {
        this.setState({
          area: area[0] + area[1] + area[2],
          areaList: area
        })
      }
    }
  }

  // 选择图片
  onChange = (files, type, index, mode) => {
    if (mode === 0) {
      this.setState({filePhoto: files}, () => {
        if (type === 'remove') {
          return;
        }
        ;this.uploadImg(mode)
      });
    } else if (mode === 1) {
      this.setState({fileCardA: files}, () => {
        if (type === 'remove') {
          return;
        }
        ;this.uploadImg(mode)
      });
    } else if (mode === 2) {
      this.setState({fileCardB: files}, () => {
        if (type === 'remove') {
          return;
        }
        ;this.uploadImg(mode)
      });
    }
  };

  // 上传图片
  async uploadImg(mode) {
    let {filePhoto, fileCardA, fileCardB} = this.state;
    let formData = new FormData();
    if (mode === 0) {
      formData.append("Filename", filePhoto[0].file.name);
      formData.append("imgFile", filePhoto[0].url);
    } else if (mode === 1) {
      formData.append("Filename", fileCardA[0].file.name);
      formData.append("imgFile", fileCardA[0].url);
    } else if (mode === 2) {
      formData.append("Filename", fileCardB[0].file.name);
      formData.append("imgFile", fileCardB[0].url);
    }
    const value = await fetch.uploadImg(formData);
    if (value.status) {
      if (mode === 0) {
        filePhoto[0].realUrl = value.url;
        filePhoto[0].uploaded = true;
        this.setState({filePhoto})
      } else if (mode === 1) {
        fileCardA[0].realUrl = value.url;
        fileCardA[0].uploaded = true;
        this.setState({fileCardA})
      } else if (mode === 2) {
        fileCardB[0].realUrl = value.url;
        fileCardB[0].uploaded = true;
        this.setState({fileCardB})
      }
    } else {
      if (mode === 0) {
        this.setState({filePhoto: []});
        Toast.fail('手持身份证上传失败', 2);
      } else if (mode === 1) {
        this.setState({fileCardA: []});
        Toast.fail('身份证(正面)上传失败', 2);
      } else if (mode === 2) {
        this.setState({fileCardB: []});
        Toast.fail('身份证(反面)上传失败', 2);
      }
    }
  }


  // 提交申请
  async apply() {
    if(this.state.checked){
      Toast.offline('请同意阅读代理协议',1);
      return;
    }
    this.chgDisabled(true);
    const {dispatch, userData} = this.props;
    let _id = userData.user._id;
    const {area, areaList, filePhoto, fileCardA, fileCardB, agent_type} = this.state;
    let agent_name = this.agent_name.state.value;
    let agent_mobile = this.agent_mobile.state.value;
    let agent_card = this.agent_card.state.value;
    let agent_address = this.agent_address.state.value;
    if (agent_name === '') {
      Toast.offline('请填写商家名称', 2);
      this.chgDisabled(false);
      return
    }
    ;
    if (agent_mobile === '') {
      Toast.offline('请填写商家手机', 2);
      this.chgDisabled(false);
      return
    }
    ;
    if (agent_card === '') {
      Toast.offline('请填写身份证号', 2);
      this.chgDisabled(false);
      return
    }
    if (agent_type === 0) {
      Toast.offline('请选择代理级别', 2);
      this.chgDisabled(false);
      return
    }
    if (agent_address === '') {
      Toast.offline('请填写详细地址', 2);
      this.chgDisabled(false);
      return
    }
    ;
    let sql = {_id, agent_name, agent_mobile, agent_card, agent_address, agent_type};


    // 判断是否选择地址
    if (areaList.length === 0) {
      Toast.offline('请选择地址', 2);
      this.chgDisabled(false);
      return;
    } else {
      sql.agent_province = areaList[0];
      sql.agent_city = areaList[1];
      if (areaList.length === 3) {
        sql.agent_area = areaList[2];
      }
    }
    ;

    // 判断手持身份证
    if (filePhoto.length !== 0) {
      if (filePhoto[0].uploaded) {
        sql.agent_handCredUrl = filePhoto[0].realUrl;
      } else {
        Toast.offline('手持身份证(上半身)正在上传', 2);
        this.chgDisabled(false);
        return;
      }
    } else {
      Toast.offline('请上传手持身份证(上半身)照片', 2);
      this.chgDisabled(false);
      return;
    }

    // 判断身份证正面
    if (fileCardA.length !== 0) {
      if (fileCardA[0].uploaded) {
        sql.agent_cardUrl1 = fileCardA[0].realUrl;
      } else {
        Toast.offline('身份证(正面)正在上传', 2);
        this.chgDisabled(false);
        return;
      }
    } else {
      Toast.offline('请上传身份证(正面)', 2);
      this.chgDisabled(false);
      return;
    }
    // 判断身份证反面
    if (fileCardB.length !== 0) {
      if (fileCardB[0].uploaded) {
        sql.agent_cardUrl2 = fileCardB[0].realUrl;
      } else {
        Toast.offline('身份证(反面)正在上传', 2);
        this.chgDisabled(false);
        return;
      }
    } else {
      Toast.offline('请上传身份证(反面)', 2);
      this.chgDisabled(false);
      return;
    }

    const value = await fetch.applyAgent(sql);
    if (value.status) {
      Toast.success('申请成功,等待审核', 2, () => {
        dispatch(routerRedux.push('/mine'))
      });
    } else {
      Toast.fail(value.message, 2);
      this.chgDisabled(false);
    }

  }

//协议
  async componentDidMount() {
    const data = await external.xieyi();
    this.setState({userArg: data.resource.agentAgreement})
  }

  render() {
    const {history, dispatch} = this.props;
    const {disabled, area, filePhoto, fileCardA, fileCardB, agent_type} = this.state;
    // 传入navbBar参数
    const navBarProps = {
      leftVisible: true,
      leftFunc() {
        dispatch(routerRedux.goBack())
      },
      titleName: '申请代理',
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
            <p className={styles.title}>代理名称：</p>
            <InputItem type='text' placeholder='' ref={el => this.agent_name = el}/>
            <p className={styles.title}>手机号码：</p>
            <InputItem type='number' maxLength={11} placeholder='' ref={el => this.agent_mobile = el}/>
            <p className={styles.title}>身份证号：</p>
            <InputItem type='text' maxLength={18} placeholder='' ref={el => this.agent_card = el}/>
            <p className={styles.title}>代理级别：</p>
            <InputItem type='text' onClick={() => this.showActionSheet()}
                       value={agent_type === 0 ? '' : agent_type === 1 ? '区域代理' : '总代理'} placeholder='点击选择代理级别'
                       editable={false}/>
            <p className={styles.title}>代理地区：</p>
            <Picker
              extra=' '
              data={this.state.agent_type === 2 ? oPtions : options}
              onOk={e => this.chgArea(e)}
              onDismiss={e => this.chgArea(e)}
              ref={el => this.picker = el}
            >
              <InputItem className='addrpicker' value={area} editable={false} type='text' placeholder='点击选择代理地区'/>
            </Picker>
            <p className={styles.title}>详细地址：</p>
            <InputItem type='text' placeholder='' ref={el => this.agent_address = el}/>
            <p className={styles.title}>手持身份证(上半身)照片：</p>
            <Item
              extra={
                <ImagePicker
                  length={1}
                  files={filePhoto}
                  onChange={(files, type, index) => this.onChange(files, type, index, 0)}
                  selectable={filePhoto.length < 1}
                />
              }
            />
            <p className={styles.title}>身份证(正面)：</p>
            <Item
              extra={
                <ImagePicker
                  length={1}
                  files={fileCardA}
                  onChange={(files, type, index) => this.onChange(files, type, index, 1)}
                  selectable={fileCardA.length < 1}
                />
              }
            />
            <p className={styles.title}>身份证(背面)：</p>
            <Item
              extra={
                <ImagePicker
                  length={1}
                  files={fileCardB}
                  onChange={(files, type, index) => this.onChange(files, type, index, 2)}
                  selectable={fileCardB.length < 1}
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
            <span className={styles.hov} onClick={() => this.setState({dis: !this.state.dis})}>我已阅读并同意《代理协议》</span>
          </div>
          <div className={styles.btnBox}>
            <Button type='primary' disabled={disabled} loading={disabled} onClick={() => this.apply()}>确认提交</Button>`
          </div>
        </div>
      </div>
    )
  }
}
