import React, {Component} from 'react';
import Header from "../Common/Header/Header";
import style from './styles/Message.less';
import MyNavBar from "../components/MyNavBar";
import {routerRedux} from "dva/router";
import {connect} from "dva/index";
import  * as user from '../services/user';
import {Toast} from 'antd-mobile';
import {timetrans} from '../timetrans';
@connect(state => ({shopData: state.shop}))
export default class Message extends Component {
  constructor(){
    super();
    this.state={data:[]}
  }

  async handleSendInfo(){
    const {history}=this.props;
    const data=await user.znx({message:this.refs.message.value});
    data.status?Toast.success(data.message,2,()=>history.push('/messagedetail')):Toast.offline(data.message,2);
    this.refs.message.value='';
  }
  async componentDidMount(){
    const data=await user.getznx({page:1,size:2});
    this.setState({data:data.resource});
  }
  render() {
    const {history,dispatch,shopData}=this.props;
    const {data}=this.state;
    const navBarProps = {
      leftVisible:true,
      leftFunc(){
        dispatch(routerRedux.goBack())
      },
      titleName:"留言",
    };

    return (
      <div>
        <MyNavBar {...navBarProps}/>
        <div className={style.containerBox}>
          <textarea  ref='message' name="" id="" cols="30" rows="10" placeholder='请输入留言内容'/>
          <button onClick={this.handleSendInfo.bind(this)}>提交</button>
        </div>
        {
          data.length>0?data.map((item,index)=>(
            <div key={index} className={style.footerBox}>
              <p>我的留言:</p>
              <p>{timetrans(item.createTime)}</p>
              <p>{item.message}</p>
              <p>系统回复：{item.replyMessage}</p>
              <p onClick={()=>history.push('/messagedetail')}>查看更多</p>
            </div>
          )):''
        }
      </div>
    )
  }
}
