import React,{Component} from 'react';
import Header from "../../Common/Header/Header";
import styles from './noticeDetail.less';
import queryString from 'querystring';
import * as user from '../../services/user';
export function timetrans(date){
  date = new Date(date);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  let s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y+M+D+h+m+s;
}

export default class NoticeDetail extends Component{
  constructor(props) {
    super(props);
    this.state={res:''}
  }

  async componentDidMount(){
    const {location}=this.props;
    const parse=queryString.parse(location.search.replace('?',''));
    let res=await user.gonggaoGetID({id:parse.index});
    this.setState({res:res.resource})
  }
  render(){
    const {content,createTime,title}=this.state.res;
    return (
      <div>
        <Header  tilte='公告详情' image={require('../../assets/images/jiantou.png')}/>
        <div className={styles.CONT}>
          <div className={styles.C_D1}>{title}</div>
          <div className={styles.C_D2}>{content}</div>
          <div>{timetrans(createTime)}</div>
        </div>
      </div>
    )
  }
}
