import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/IndexPage.less";
import { Button,Toast,SearchBar,Carousel,Modal,Grid,NoticeBar ,WhiteSpace,Icon,List} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import GoodItem from '../components/GooodItem';
import InfiniteScroll from 'react-infinite-scroller';
import good01 from '../assets/images/good01.png';
import lunbo from '../assets/images/lunbo.png';
import grid01 from '../assets/gridicon/grid01.png';
import grid02 from '../assets/gridicon/grid02.png';
import grid03 from '../assets/gridicon/grid03.png';
import grid04 from '../assets/gridicon/grid04.png';
import grid05 from '../assets/gridicon/grid05.png';
import grid06 from '../assets/gridicon/grid06.png';
import grid07 from '../assets/gridicon/grid07.png';
import grid08 from '../assets/gridicon/grid08.png';
import grid09 from '../assets/gridicon/grid09.png';
import grid010 from '../assets/gridicon/grid010.png';
import JDIcon from '../assets/icon/JDIcon.png';
const Item=List.Item;

// 把model 传入props
@connect(state => ({shopData: state.shop}))
export default class IndexPage extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            selectedTabBar: "shop",
          arr:[],
          Dt:[]

        };
    }

    // 跳页
    nextPage(url){
        const{dispatch}=this.props;
        dispatch(routerRedux.push(url))
    }

    // 点击分类
    tapGrid(el,index){

        const{dispatch,history}=this.props;
        if(index===0){
           history.push('/neverup')
        }else if(index===1){
            Toast.offline('暂未开放',2);
        }else if(index===2){
            Toast.offline('暂未开放',2);
        }else{
            this.nextPage('/goodlist?_id='+el._id)
        }

    }
    //加载更多的方法,写法固定,只需替换变量名
    loadFunc(e){
        const {dispatch,shopData}=this.props;
        let page=shopData.pagination.page+1;
        dispatch({
          type:'shop/getHotGoodsList',
          payload:{
            page,
            size:10
          }
        })
    }
    handleClickImg(data){
      console.log(data,'轮播图中的每一项');
      const {history}=this.props;
      if(data.type===1){
        history.push('/gooddetail?_id='+data.url)
      }else if(data.type===2){
        history.push('/shop?_id='+data.url)
      }else if(data.type===3){
        window.location.href=data.url;
      }

    }
async componentDidMount(){
      const data=await fetch.postMS({});
  const Dt=await fetch.xiaoLB({});
  this.setState({Dt:Dt.resource});

  this.setState({arr:data.resource});

}
  handleClickID(i){
    const{dispatch}=this.props;
    dispatch(routerRedux.push('/miaodetail'+'?index='+i))
  }
    render() {
      const {arr}=this.state;

      const {history,dispatch,shopData}=this.props;
        // 列表是否有下一页
        let hasMore=shopData.pagination.hasMore;
        // 轮播图数据
        let carouselList=shopData.carouselList;
      console.log(carouselList,'轮播图数据');
      // 分类数据
        let classifyList=shopData.classifyList;
        let label=[
            {name:'唯品会',pic:grid01},
            {name:'京东',pic:grid02},
            {name:'拼多多',pic:grid03},
        ]
        classifyList=label.concat(classifyList);

        // 活动公告列表
        let newsList=shopData.newsList;

      // 热门商品列表数据
        let hotGoodsList=shopData.hotGoodsList;

        // 商品列表的参数
        const goodListProps = {
            goodData: hotGoodsList,
            tapItem(item){
                dispatch(routerRedux.push("/gooddetail?_id="+item._id))
            }
        }

        // 传入tabBar参数
        const tabBarProps = {
            selectedTabBar: this.state.selectedTabBar,
            history
        }


        return (
            <div className={styles.rootBox}>
                <style>
                    {`
                        .am-carousel ul{
                            height: 4.2rem !important;
                        }
                        .am-grid-carousel .am-carousel ul{
                            height: 3.56rem !important;
                            background-color: #FFFFFF;
                        }
                        .am-grid-carousel .am-carousel .am-carousel-wrap{
                            background-color: #FFFFFF;
                        }
                        .am-grid-item-content{
                            padding: 0 !important;
                        }
                    `}
                </style>
                {/*底部标签栏*/}
                <MyTabBar {...tabBarProps}/>

                {/*主体部分 */}
                <div className={styles.main}>
                    {/* 轮播图和搜索 */}
                    <div className={styles.mainTop}>
                        {/* 轮播 */}
                        <Carousel
                            autoplay={true}
                            infinite
                        >
                            {carouselList.map((i,index) => (
                                <div
                                key={index}
                                onClick={this.handleClickImg.bind(this,i)}
                                style={{ display: 'inline-block', width: '100%', height: '4.2rem'}}
                                >
                                    <img
                                        src={APIHost+i.picture}
                                        alt=""
                                        style={{ width: '100%', height: '4.2rem',  verticalAlign: 'top' }}
                                    />
                                </div>
                            ))}
                        </Carousel>
                        {/* 搜索 */}
                        <div className={styles.searchBox}>
                            <SearchBar placeholder="搜索" onSubmit={(val)=>history.push('/goodlist?keyword='+val)} />
                        </div>
                    </div>

                    {/*分区*/}
                    <Grid
                        className={styles.grid}
                        data={classifyList}
                        hasLine={false}
                        carouselMaxRow={2}
                        isCarousel
                        columnNum={5}
                        square={false}
                        dotStyle={{width:".32rem",height:".08rem",borderRadius:".04rem"}}
                        dotActiveStyle={{width:".32rem",background:"#F33752",height:".08rem",borderRadius:".04rem"}}
                        onClick={(el,index)=>this.tapGrid(el,index)}
                        renderItem={(dataItem) => (
                            <div className={styles.gridItem}>
                                <img src={dataItem.maxIcon?APIHost+dataItem.maxIcon:dataItem.pic} alt="" />
                                <span>{dataItem.name}</span>
                            </div>
                        )}
                    />
                    {/* 公告 */}

                  {
                    newsList.length>0?(
                      <List>
                        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
                          {newsList[0].title}
                        </NoticeBar>
                      </List>
                    ):""
                    }
                  {
                    arr.length<1?'':(<div className={styles.notice}>
                      <span>商城公告</span>
                      <WhiteSpace size="lg" />
                      <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
                        <div className={styles.noticeItem}><span>热门</span>{newsList.title}</div>
                      </NoticeBar>
                    </div>)
                  }
                    {/*商品列表标题*/}
                  {arr.length<1?'':(<div className={styles.listTitle}>
                    <span>{arr[0]?(arr[0].title):''}</span>
                    <span>hot</span>
                  </div>)}
                    {/*秒杀和推荐*/}
                  {
                    arr.length<1?"":( <div className={styles.hot}>
                      <div className={styles.hotLeft}>
                        <div className={styles.leftTitle}>

                          <div>
                            <p>限时秒杀</p>
                            <p style={{width:'1.5rem'}}>{arr[1]?(arr[1].title):''}</p>
                          </div>
                        </div>
                        <div className={styles.leftBody}>
                          <div onClick={this.handleClickID.bind(this,(arr[0]?arr[0].goodsId:''))}><img src={arr[0]?(APIHost+arr[0].picture):''} alt=""/></div>
                          <div onClick={this.handleClickID.bind(this,(arr[1]?arr[1].goodsId:''))}><img src={arr[1]?(APIHost+arr[1].picture):''} alt=""/></div>
                          <div onClick={this.handleClickID.bind(this,(arr[2]?arr[2].goodsId:''))}><img src={arr[2]?(APIHost+arr[2].picture):''} alt=""/></div>
                          <div onClick={this.handleClickID.bind(this,(arr[3]?arr[3].goodsId:''))}><img src={arr[3]?(APIHost+arr[3].picture):''} alt=""/></div>
                        </div>
                      </div>


                      <div className={styles.hotRight}>
                        <div className={styles.rightTop}>
                          <div className={styles.title}>
                            <div>
                              <span>限时秒杀</span>
                              <span>优品大集合</span>
                            </div>
                          </div>
                          <div className={styles.body}>
                            <div onClick={()=>history.push('/grouponDetail')}><img src={arr[4]?(APIHost+arr[4].picture):''} alt=""/></div>
                            <div onClick={this.handleClickID.bind(this,(arr[5]?arr[5].goodsId:''))}><img src={arr[5]?(APIHost+arr[5].picture):''} alt=""/></div>
                          </div>
                        </div>
                        <div className={styles.rightBottom}>
                          <div className={styles.title}>
                            <img src={JDIcon} alt=""/>
                            <div>
                              <p>限时秒杀</p>
                              <p>优品大集合</p>
                            </div>
                          </div>
                          <div className={styles.body}>
                            <div onClick={this.handleClickID.bind(this,(arr[6]?arr[6].goodsId:''))}><img src={arr[6]?(APIHost+arr[6].picture):''} alt=""/></div>
                            <div onClick={this.handleClickID.bind(this,(arr[7]?arr[7].goodsId:''))}><img src={arr[7]?(APIHost+arr[7].picture):''} alt=""/></div>
                          </div>
                        </div>
                      </div>
                    </div>)

                  }
                  <Carousel
                    autoplay={true}
                    infinite
                  >
                    {this.state.Dt.map((i,index) => (
                      <div
                        key={index}
                        onClick={this.handleClickImg.bind(this,i)}
                        style={{ display: 'inline-block', width: '100%', height: '4.2rem'}}
                      >
                        <img
                          src={APIHost+i.picture}
                          alt=""
                          style={{ width: '100%', height: '4.2rem',  verticalAlign: 'top' }}
                        />
                      </div>
                    ))}
                  </Carousel>
                    {/* 商品列表标题 */}
                    <div className={styles.listTitle}>
                        <span>猜你喜欢</span>
                        <span>Guess you like</span>
                    </div>
                    {/*商品列表 自动刷新*/}
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={(e)=>this.loadFunc(e)}
                        hasMore={hasMore}
                        threshold={100}
                        loader={<div className="loader" style={{fontSize:".28rem",lineHeight:".36rem",textAlign:"center",marginBottom:".3rem"}} key={0}>加载中...</div>}
                    >
                        <GoodItem {...goodListProps} />
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}
