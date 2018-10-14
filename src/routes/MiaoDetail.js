import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import queryString from 'query-string';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/grouponDetail.less";
import { Button,Toast,WhiteSpace} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import {timetrans} from '../timetrans';
import * as fetch from '../services/shop';
import good01 from '../assets/images/good01.png';
function checkTime(i){ //将0-9的数字前面加上0，例1变为01
  if(i<10)
  {
    i = "0" + i;
  }
  return i;
}

function formatTimeStyle(timeNum){
  var leftTime = timeNum; //计算剩余的毫秒数
  var days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数
  var hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时
  var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
  var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
  days = checkTime(days);
  hours = checkTime(hours);
  minutes = checkTime(minutes);
  seconds = checkTime(seconds);
  return days+"天" + hours+"小时" + minutes+"分"+seconds+"秒";
}
@connect(state => ({shopData: state.shop}))
export default class GrouponDetail extends Component {

  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      data:'',
      a:'',
      startTime:'',
      endTime:'',
      newTime:'',
      s:'',
      timeStr: "",
      activeState: 0,   // 活动是否开始的状态 0未开始 1进行中 2一结束
    };
  }
  async handleClickShop(){
    const {dispatch,location}=this.props;
    const parse=queryString.parse(location.search.replace('?',''));
    let sql={storeGoods:[this.state.data.resource,{goodsId:parse.index,number:2,selectType:true}]};

    const value=await fetch.saveOrder(sql);
    if(value.status){
      Toast.success(value.message,2,()=>{
        dispatch(routerRedux.push('/confirmorder'+'?index='+1))
      });
    }else{
      Toast.fail(value.message,2);
    }
    console.log(value,'@');

  }
 async componentDidMount(){
    const {dispatch,location}=this.props;
    const parse=queryString.parse(location.search.replace('?',''));
   console.log(parse.index);
   const data=await fetch.miaoSFunc(parse.index);
   console.log(data,APIHost+data.resource.multiple[0],'!!!!!!!');
   if(data.status && data.resource._id){   //请求生成
     var currentTime = new Date().getTime();
     var startTime = data.resource.eckill.startTime;
     var endTime = data.resource.eckill.endTime;
     var timeNum = 0;
     if(currentTime<startTime){  //活动未开始
       timeNum = startTime - currentTime;
       this.setState({
         data,
         activeState: 0,
       })
     }else if(currentTime>=startTime && currentTime<endTime){    //活动进行中
       timeNum = endTime - currentTime;
       this.setState({
         data,
         activeState: 1,
       })
     }else{    // 活动结束 清除定时器
       this.setState({
         data,
         activeState: 2,
         timeStr: `${'0'}天 ${'00'}小时 ${'00'}分${'00'}秒`
       })
     }
   }else{
     Toast.offline(data.message, 1.5, ()=>{
       dispatch(routerRedux.goBack())
     })
   }
   this.startTimeFunc(timeNum,data.resource.eckill.endTime);
 }
handle=(s)=>{
  return setInterval(()=>{
    s--;
    // console.log(s--);
 },1000)
};
  startTimeFunc(timeNum,startTime, endTime){
    const _this = this;
   var timer = setInterval(function () {
      var timeStr = formatTimeStyle(timeNum);
      _this.setState({timeStr: timeStr});
      if(timeNum>1000){
        timeNum = timeNum-1000;
      }else{
        var currentTime = new Date().getTime();
        if(currentTime<startTime){  //活动未开始
          timeNum = startTime - currentTime;
          _this.setState({activeState: 0})
        }else if(currentTime>=startTime && currentTime<endTime){    //活动进行中
          timeNum = endTime - currentTime;
          _this.setState({activeState: 1})
        }else{    // 活动结束 清除定时器
          clearInterval(timer);
          _this.setState({activeState: 2, timeStr: `${'0'}天 ${'00'}小时 ${'00'}分${'00'}秒`})
        }

      }
    },1000);

  }
  render() {
    const {data,startTime,endTime,newTime,activeState,timeStr}=this.state;
    const {history,dispatch}=this.props;
    // 传入navbBar参数
    const navBarProps = {
      leftVisible:true,

      leftFunc(){
        dispatch(routerRedux.goBack())
      },
      titleName:'秒杀详情',
      background:'#FFFFFF',
      titleColor:'#333333',
      sideColor:'#333333',
    }

    return (
      <div className={styles.rootBox}>
        <style>
          {
            `
                        .leftbtn {
                            background-color: #FFFFFF;
                            color:#FE4070;
                            border:1px solid #FE4070;
                        }
                        .rightbtn{
                            background-color: #FE4070;
                        }

                        `
          }
        </style>
        {/*头部导航栏*/}
        <MyNavBar {...navBarProps}/>
        <div className={styles.main}>
          {/* 主图 */}
          <div className={styles.mainImg}>
            <img src={data.resource?(APIHost+data.resource.multiple[0]):''} alt=""/>
          </div>
          {/* 留白 */}
          <WhiteSpace></WhiteSpace>
          {/* 商品信息 */}
          {/*this.handle(this.state.s)*/}
          <div className={styles.goodInfo}>
            <p className={styles.infoPrice}><span>¥{data.resource?(data.resource.eckill.price):''}</span><span>正常价¥{data.resource?(data.resource.model[0].propertyOriginalPrice):''}</span></p>
            <p className={styles.infoTime}><span>{activeState==0?('活动倒计时开始：'+timeStr):(activeState==1?('活动倒计时结束：')+timeStr:timeStr)}</span><span>逾期未成团自动退款</span></p>
            <p className={styles.infoName}><span>「商品：」</span><span>{data.resource?(data.resource.name):''}</span></p>
          </div>
          {/* 底部Tab */}
          <div className={styles.tab}>
            <div className={styles.tabLeft}>
              <Button className="leftbtn" type='primary'>¥499.00<br/>单独买</Button>
            </div>
            <div className={styles.tabRight}  onClick={this.handleClickShop.bind(this)}>
              <Button className="rightbtn" type='primary'>立即购买</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
