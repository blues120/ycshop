import React, {Component} from 'react';
import Header from "../components/Header/Header";
import style from './styles/Message.less';
import * as user from "../services/user";
import {timetrans} from "../timetrans";
import InfiniteScroll from 'react-infinite-scroller';
import {connect} from "dva/index";
@connect(state => ({shopData: state.shop}))
export default class MessageDetail extends Component {
  constructor(){
    super();
    this.state={data:[]}
  }
  render() {
    const {data}=this.state;
    const {history,dispatch,shopData}=this.props;
    let hasMore=shopData.pagination.hasMore;
    return (
      <div style={{paddingTop:'1rem'}}>
        <Header title='回复详情' image={require('../assets/images/jiantou.png')}/>
        <InfiniteScroll
          pageStart={0}
          loadMore={(e)=>this.loadFunc(e)}
          hasMore={hasMore}
          threshold={100}
          loader={<div className="loader" style={{fontSize:".28rem",lineHeight:".36rem",textAlign:"center",marginBottom:".3rem"}} key={0}>加载中...</div>}
        >
          {
            shopData.goodList.length>0?shopData.goodList.map((item,index)=>(
              <div key={index} className={style.footerBox}>
                <p>我的留言:</p>
                <p>{timetrans(item.createTime)}</p>
                <p>{item.message}</p>
                <p>系统回复：{item.replyMessage}</p>
                {/*<p onClick={()=>history.push('/messagedetail')}>查看更多</p>*/}
              </div>
            )):''
          }
        </InfiniteScroll>

      </div>
    )
  }
}
