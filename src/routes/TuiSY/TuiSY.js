import React,{Component} from 'react';
import Header from "../../Common/Header/Header";
import * as user from '../../services/user';
import styles from "../styles/rechargeList.less";
import {timetrans} from "../../timetrans";
import InfiniteScroll from "react-infinite-scroller";
import {connect} from "dva";
@connect(state => ({
  userData: state.user
}))
export default class TuiSY extends Component{
  constructor(props) {
    super(props);
  }
  loadFunc(e){
    const {dispatch,userData}=this.props;
    let page=userData.pagination.page+1;
    dispatch({
      type:'user/tuisy',
      payload:{
        page,
        size:10
      }
    })
  }

  render(){
    const {history,dispatch,userData}=this.props;
    let hasMore=userData.pagination.hasMore;
    let tuisyList=userData.tuisyList;
    console.log(tuisyList,'屎');
    return (
      <div className={styles.rootBox} style={{marginTop:'1rem'}}>
        <Header title='推广收益' image={require('../../assets/images/jiantou.png')}/>
        <div className={styles.main}>
          <InfiniteScroll
            pageStart={0}
            loadMore={(e)=>this.loadFunc(e)}
            hasMore={hasMore}
            threshold={100}
            loader={<div className="loader" style={{fontSize:".28rem",lineHeight:".36rem",textAlign:"center",marginBottom:".3rem"}} key={0}>加载中...</div>}
          >
          <div className={styles.cardList}>
            { /* 子项 */}
            {
              tuisyList.length>0?tuisyList.map((i,index)=>{
                if(i.type===1){
                  return(
                    <div key={index} className={styles.cardItem}>
                      <p><span>变动方式： </span><span> 个人收益明细</span></p>
                      <p><span>收益来源：  </span><span>{i.fromUser}</span></p>
                      <p><span>获取金额：  </span><span>{Number(i.gold).toFixed(2)}</span></p>
                      <p><span>收益时间： </span><span>{timetrans(i.createTime)}</span></p>
                    </div>
                  )
                }else if(i.type===2){
                  return(
                    <div key={index} className={styles.cardItem}>
                      <p><span>变动方式： </span><span> 淘宝预估原始积分明细</span></p>
                      <p><span>收益来源：  </span><span>{i.fromUser}</span></p>
                      <p><span>获取金额：  </span><span>{Number(i.gold).toFixed(2)}</span></p>
                      <p><span>收益时间： </span><span>{timetrans(i.createTime)}</span></p>
                    </div>
                  )
                }else if(i.type===3){
                  return(
                    <div key={index} className={styles.cardItem}>
                      <p><span>变动方式： </span><span> 淘宝预估收益明细</span></p>
                      <p><span>收益来源：  </span><span>{i.fromUser}</span></p>
                      <p><span>获取金额：  </span><span>{Number(i.gold).toFixed(2)}</span></p>
                      <p><span>收益时间： </span><span>{timetrans(i.createTime)}</span></p>
                    </div>
                  )
                }
              }):""
            }
          </div>
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}
