import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/reviewList.less";
import { Button,Toast} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import good01 from '../assets/images/good01.png';
import InfiniteScroll from 'react-infinite-scroller';
import {timetrans} from '../timetrans';
import person from '../assets/icon/person.jpg';
let queryString = require('querystring');
@connect(state => ({shopData: state.shop}))
export default class ReviewList extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            _id:0,
          userName:''
        };
    }

    componentWillMount(){
        const {dispatch,location}=this.props;
        location.search=location.search.replace("?","")
        const parsed = queryString.parse(location.search);
        if(parsed._id){
            this.setState({_id:parsed._id})
        }else{
            Toast.offline('商品信息错误请重试',2,()=>{
                dispatch(routerRedux.push('/'))
            })
        }
    }
    componentDidMount(){
      const user=JSON.parse(localStorage.getItem('user')).username;
      this.setState({userName:user})
      console.log(user,'ccccc');
    }
    //加载更多的方法,写法固定,只需替换变量名
    loadFunc(e){
        const {dispatch,shopData}=this.props;
        const {_id}=this.state;
        let page=shopData.pagination.page+1;
        dispatch({
          type:'shop/getReviewList',
          payload:{
            goodsId:_id,
            page,
            size:10
          }
        })
    }
  async handleDleClick(i){
      const {history}=this.props;
      const data=await fetch.delPl(i);
      data.status?Toast.success(data.message,2,()=>history.goBack()):Toast.offline(data.message,2)

  }
  handleXGClick(i){
      const {dispatch}=this.props;
      dispatch(routerRedux.push('/review'+'?index='+i))
  }
    render() {
        const {history,dispatch,shopData}=this.props;
        let reviewList=shopData.reviewList;
      console.log(reviewList,'@!@!');
      // 列表是否有下一页
        let hasMore=shopData.pagination.hasMore;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:'全部评论',
        }

        return (
            <div className={styles.rootBox}>

                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>
                <div className={styles.main}>
                    {/*列表 自动刷新*/}
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={(e)=>this.loadFunc(e)}
                        hasMore={hasMore}
                        threshold={100}
                        loader={<div className="loader" style={{fontSize:".28rem",lineHeight:".36rem",textAlign:"center",marginBottom:".3rem"}} key={0}>加载中...</div>}
                    >
                        <div className={styles.List}>
                            {/* 评论子项 */}
                            {
                                reviewList.map((i,index)=>{
                                    return(
                                        <div key={index} className={styles.Item}>
                                            <p className={styles.name}><span><img src={i.headImg===null?person:APIHost+i.headImg} alt=""/></span> {i.name}</p>
                                            <p className={styles.prop}>{timetrans(i.createTime)}<span>{i.guige}</span></p>
                                            <p className={styles.body}>{i.message}</p>

                                            <div className={styles.imgBox}>
                                                {
                                                    i.imgs.map((i,index)=>{
                                                        return(
                                                            <img key={index} src={APIHost+i} alt=''/>
                                                        )
                                                    })
                                                }
                                            </div>
                                          <div className={styles.delBox}  style={{display:this.state.userName===i.username?'flex':'none'}}>
                                            <div onClick={this.handleDleClick.bind(this,i._id)}>删除</div>
                                            <div onClick={this.handleXGClick.bind(this,i._id)}>修改</div>
                                          </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </InfiniteScroll>

                </div>
            </div>
        )
    }
}
