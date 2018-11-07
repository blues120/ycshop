import React, {Component} from 'react';
import Header from "../../Common/Header/Header";
import styles from './notice.less';
import history from 'history/createBrowserHistory';
import * as user from '../../services/user';
import {connect} from "dva";
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

@connect(state => ({shopData: state.shop}))

export default class Notice extends Component {
  constructor(props) {
    super(props);
    this.state={data:[]}
  }


  async componentDidMount(){
    const data=await user.gonggaoGet({page:1,size:10});
    this.setState({data:data.resource});
  }
  render() {
    const {history}=this.props;
    const data=this.state.data;
    return (
      <div>
        <Header title='公告' image={require('../../assets/images/jiantou.png')}/>
        <div className={styles.CONTAINER}>
          {
            data?data.map((i,d)=>{
              const {createTime,title,content,_id}=i;
              return(
                <div key={d} className={styles.lists} onClick={()=>history.push('/noticedetail'+'?index='+_id)}>
                  <p className={styles.lists_p}><span className={styles.lists_p_s1}>{title}</span>
                    <span className={styles.lists_p_s2}>{content}</span></p>
                  <p className={styles.lists_pp}>{timetrans(createTime)}</p>
                </div>
              )
            }):''
          }
        </div>
      </div>
    )
  }
}
