import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/team.less";
import { Button,Toast} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/user';
import InfiniteScroll from 'react-infinite-scroller';
import person from '../assets/icon/person.jpg';
import {timetrans} from '../timetrans';
@connect(state => ({userData: state.user}))
export default class Team extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            tabType: 1,
        };
    }

    // 改变显示分类
    chgTabType(type){
        const {dispatch,userData}=this.props;
        this.setState({
        tabType:type,
        },()=>{
        dispatch({
            type:'user/getTeamList',
            payload:{
            changed:true,
            type,
            page:1,
            size:10
            }
        })
        })
    }

    //加载更多的方法,写法固定,只需替换变量名
    loadFunc(e){
        const {dispatch,userData}=this.props;
        const {tabType}=this.state;
        let type=tabType;
        let page=userData.pagination.page+1;
        dispatch({
          type:"user/getTeamList",
          payload:{
            type,
            page,
            size:10
          }
        })
    }
componentDidMount(){
  var tel = "18827768782";
  var reg = /^(\d{3})\d{4}(\d{4})$/;
  tel = tel.replace(reg, "$1****$2");
}
    render() {
      var reg = /^(\d{3})\d{4}(\d{4})$/;

      const {history,dispatch,userData}=this.props;
        let teamList=userData.teamList;
      // 列表是否有下一页
        let hasMore=userData.pagination.hasMore;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.push('/mine'))
            },
            titleName:"我的团队",
        }
        return (
            <div className={styles.rootBox}>

                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>
                <div className={styles.tabBar}>
                        <span className={this.state.tabType==1?styles.active:""} onClick={()=>this.chgTabType(1)}>一级</span>
                        <span className={this.state.tabType==2?styles.active:""} onClick={()=>this.chgTabType(2)}>二级</span>
                        <span className={this.state.tabType==3?styles.active:""} onClick={()=>this.chgTabType(3)}>三级</span>
                    </div>
                <div className={styles.main}>

                    {/*商品列表 自动刷新*/}
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={(e)=>this.loadFunc(e)}
                        hasMore={hasMore}
                        threshold={100}
                        loader={<div className="loader" style={{fontSize:".28rem",lineHeight:".36rem",textAlign:"center",marginBottom:".3rem"}} key={0}>加载中...</div>}
                    >
                        {
                            teamList.map((i,index)=>{
                                return(
                                    <div key={index} className={styles.teamItem}>
                                        <div className={styles.headIcon}>
                                            <img src={i.headerImg?APIHost+i.headerImg:person} alt=""/>
                                        </div>
                                        <div className={styles.info}>
                                            <p className={styles.name}>{i.name}</p>
                                            <p className={styles.time}>{(i.mobile).replace(reg,'$1****$2')}</p>
                                            <p className={styles.time}>{timetrans(i.createTime)}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}
