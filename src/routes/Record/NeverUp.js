import React, {Component} from 'react';
import Header from "../../Common/Header/Header";
import styles from './NeverUp.less';
import * as user from "../../services/user";
import {Toast} from 'antd-mobile';
import InfiniteScroll from 'react-infinite-scroller';
import {connect} from "dva";
async function one(page){
  const res = await user.taoBao({page: this.state.page, size: 40, topcate: '特价'});
}

function kingcwt(str) {
  if(str=='undefined')return '0';
  if (str.match(/\d+/g)[1] == '00') {
    return str.match(/\d+/g)[2];
  } else {
    return str.match(/\d+/g)[1];

  }
}
@connect(state => ({userData: state.user}))
export default class NeverUp extends Component {
  constructor() {
    super();
    this.state = {type: 'tj', Arr: [],page:1,hasMore:false,num:10}
  }

  handleEvent(ev) {
    this.setState({type: ev.type});
  }

  async componentDidMount() {
    /*特价*/
    this.screenChange();
    const res = await user.taoBao({page: this.state.page, size: 40, topcate: '特价'});
    res.resource&&res.resource.data? Toast.loading('正在加载', 1.5, () => this.setState({
      Arr: res.resource.data,
      type: ''
    })) : Toast.offline('未找到该商品，可能下架或非联盟产品', 1.5);
  }
  screenChange=()=>{
    let _this=this;
    window.addEventListener('scroll', function () {
      let ele=document.getElementById('bb');
      window.scrollY>1370?(window.scrollY>3670?(window.scrollY>5970?_this.setState({num:38,page:_this.state.page+1}):_this.setState({num:30})):_this.setState({num:20})):null;
      return;
      let ST=window.scrollY;
      _this.setState({hasMore:true})
    });
  };
  // loadFunc(e){
  //   this.setState({page:this.state.page+1,hasMore:false})
  //  this.handleRXEvent();
  // }
  async handleLink(productId) {
    const data = await user.taoBID({productId});
    window.location.href = data.data.coupon_short_url;
  }

  async handleMYEvent(e) {
    this.setState({num:10});
    /*母婴*/
    var reg = /^(<p>)/;
    if (reg.test(e.target.innerHTML)) return;
    else {
      const MYData = await user.taoBao({page: this.state.page, size: 40, topcate: '母婴', subcate: e.target.innerHTML});
      (MYData.resource&&MYData.resource.data)? Toast.loading('正在加载', 1.5, () => this.setState({
        Arr: MYData.resource.data,
        type: ''
      })) : Toast.offline('商品不存在', 1.5);

    }
  }

  async handleYZPEvent(e) {
    this.setState({num:10});
    /*优质品*/
    var reg = /^(<p>)/;
    if (reg.test(e.target.innerHTML)) return;
    else {
      const MYData = await user.taoBao({page: 1, size: 40, topcate: '优质品', subcate: e.target.innerHTML});
      (MYData.resource&&MYData.resource.data)  ? Toast.loading('正在加载', 1.5, () => this.setState({
        Arr: MYData.resource.data,
        type: ''
      })) : Toast.offline('商品不存在', 1.5);
    }
  }

  async handleRXEvent(e) {
    this.setState({num:10})
    /*热销*/
    var reg = /^(<p>)/;
    if (reg.test(e.target.innerHTML)) return;
    else {
      const MYData = await user.taoBao({page: this.state.page, size: 40, topcate: '热销', subcate: e.target.innerHTML});
      (MYData.resource&&MYData.resource.data) ? Toast.loading('正在加载', 1.5, () => this.setState({
        Arr: MYData.resource.data,
        type: ''
      })) : Toast.offline('商品不存在', 1.5);
    }
  }

  async handleData(data) {
    console.log(data,'搜索数据');
    if(data===[]||!data) return;
    let Arr = data.result_list ? data.result_list : '';
    // Toast.loading('正在加载', 1.5, () => this.setState({Arr}));
  }

  render() {

    const {history,dispatch,userData}=this.props;
    let hasMore=this.state.hasMore;
    return (
      <div className={styles.NEV}>
        <Header handleData={this.handleData.bind(this)} Search={true} qd='确定'
                image={require('../../assets/images/jiantou.png')}/>
        <InfiniteScroll
          pageStart={0}
          loadMore={(e)=>this.loadFunc(e)}
          hasMore={hasMore}
          threshold={260}
          loader={<div className="loader" style={{fontSize:".28rem",lineHeight:".36rem",textAlign:"center",marginBottom:".3rem"}} key={0}>加载中...</div>}
        >
        <div  className={styles.CONTAINER} ref='bb'>
          <div className={styles.HeadTab} onClick={e => this.handleEvent(e.target.dataset)}>
            <button data-type="rx" className={styles.bbt} style={{borderBottom:this.state.type === 'rx' ?'.01rem solid #F33752':'',color:this.state.type === 'rx' ?'#F33752':''}} onClick={this.cc}>热销
            </button>
            <button data-type="yzp" className={styles.bbt} style={{borderBottom:this.state.type === 'yzp' ?'.01rem solid #F33752':'',color:this.state.type === 'yzp' ?'#F33752':''}}>优质品</button>
            <button data-type="my" className={styles.bbt} style={{borderBottom:this.state.type === 'my' ?'.01rem solid #F33752':'',color:this.state.type === 'my' ?'#F33752':''}}>母婴</button>
            <button data-type="tj" className={styles.bbt} style={{borderBottom:this.state.type === 'tj' ?'.01rem solid #F33752':'',color:this.state.type === 'tj' ?'#F33752':''}}>特价</button>
          </div>
          <div className={styles.floatBox} style={{display: this.state.type === 'rx' ? 'flex' : 'none'}}
               onClick={this.handleRXEvent.bind(this)}>
            <p>美妆</p><p>女装</p><p>男装</p><p>家具</p>
            <p>数码</p><p>鞋包</p><p>内衣</p><p>运动</p>
            <p>食品</p><p>母婴</p>
          </div>
          <div className={styles.floatBox} style={{display: this.state.type === 'yzp' ? 'flex' : 'none'}}
               onClick={this.handleYZPEvent.bind(this)}>
            <p>美妆</p><p>女装</p><p>男装</p><p>家具</p>
            <p>数码</p><p>鞋包</p><p>内衣</p><p>运动</p>
            <p>食品</p><p>母婴</p>
          </div>
          <div className={styles.floatBox} style={{display: this.state.type === 'my' ? 'flex' : 'none'}}
               onClick={this.handleMYEvent.bind(this)}>
            <p>备孕</p><p>0至6个月</p><p>7至12个月</p><p>1至3岁</p>
            <p>4至6岁</p><p>7至12岁</p>
          </div>

          <div  id='bb' style={{marginTop: '.15rem'}} >
            {
              this.state.Arr !== [] ? this.state.Arr.map((item, index) => {
                if(index<this.state.num){
                  return  <div className={styles.goodItem} key={index}    onClick={this.handleLink.bind(this, item.num_iid)}>
                    <div className={styles.imgBox}>
                      <img src={item.pict_url} alt=""/>
                    </div>
                    <div className={styles.info}>
                      <p className={styles.name}>{item.title}</p>
                      <p className={styles.other}>{item.item_description}</p>
                      <p style={{cursor: 'pointer'}} className={styles.other}><span
                        className={styles.UL}>原价：¥{item.zk_final_price}</span><span

                        className={styles.JU}>劵：{item.coupon_info ? (kingcwt(item.coupon_info)) : 0}</span>
                      </p>
                      <p className={styles.prcie}><span style={{
                        fontSize: '.22rem',
                        color: "#999"
                      }}>券后价</span><span>¥{Math.round(parseFloat((item.zk_final_price * 1 - (item.coupon_info? (kingcwt(item.coupon_info)) : 0)) * 100)) / 100}</span><span
                        style={{fontSize: '.22rem', color: "#999", marginLeft: '.15rem'}}>奖励：</span><span
                        style={{fontSize: '.22rem'}}>{Math.round(parseFloat(((item.zk_final_price * 1 - (item.coupon_info ? kingcwt(item.coupon_info) : 0)) * (item.max_commission_rate ? item.max_commission_rate : 1) / 100) * 100)) / 100}</span>
                      </p>
                    </div>
                  </div>
                }
              }) : ''
            }
          </div>
        </div>
        </InfiniteScroll>
      </div>
    )
  }
}
