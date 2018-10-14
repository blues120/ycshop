import React, {Component} from 'react';
import {Tabs, WhiteSpace,Toast} from 'antd-mobile';
import {connect} from 'dva';
import ys from 'antd-mobile/dist/antd-mobile.css';
import Header from '../../Common/Header/Header';
import img from '../../Common/img/jiantou.png';
import styles from './record.less';
import * as user from '../../services/user';
import history from 'history/createHashHistory';
const tabs = [
  {title: '热销'},
  {title: '优质品'},
  {title: '母婴'},
  {title: '特价'}
];
const blue = {color: "#05aafa", borderBottom: ".1rem solid #05aafa"}; //成功
const ash = {color: "RGBA(185, 185, 185, 1)", borderBottom: ".1rem solid RGBA(185, 185, 185, 1)"}; //审核
const red = {color: "RGBA(250, 37, 115, 1)", borderBottom: ".1rem solid RGBA(250, 37, 115, 1)"}; //失败

function getConput (str) {
  var a=str;
  var index = a.indexOf('减');
  var moneyStr = a.slice(index+1,a.length);
  moneyStr = moneyStr.replace("元","")*1;
  return  moneyStr;
}
@connect(state => ({
  user: state.user
}))
export default class Record extends Component {
constructor(){
  super();
this.state={RX:true,YX:true,R:[],Y:[],MX:true,M:[],T:[]}
}
async componentDidMount(){
  const res=await user.taoBao({page:1,size:20,topcate:'特价'});
  console.log(res.resource,'特价');
  this.setState({T:res.resource.data})
  // res.data!==''?Toast.loading('正在路上',1.5,()=>this.setState({RX:false,T:res.data})):Toast.offline('商品暂未开放，敬请期待',1.5);

}
  async handleClickTitle(e){
    const res=await user.taoBao({page:1,size:20,topcate:'热销',subcate:e.target.innerHTML});
    console.log(res,'淘宝信息');
    res.data!==''?Toast.loading('正在路上',1.5,()=>this.setState({RX:true,R:res.resource.data})):Toast.offline('商品暂未开放，敬请期待',1.5);
  };
  async handleClickTitleTwo(e){
    const res=await user.taoBao({page:1,size:20,topcate:'优质品',subcate:e.target.innerHTML});
    console.log(res,'淘宝信息');
    res.data!==''?Toast.loading('正在路上',1.5,()=>this.setState({RX:true,Y:res.resource.data})):Toast.offline('商品暂未开放，敬请期待',1.5);
  };
  async handleClickTitleTre(e){
    const res=await user.taoBao({page:1,size:20,topcate:'优质品',subcate:e.target.innerHTML});
    console.log(res,'333333333333333');
    res.data!==''?Toast.loading('正在路上',1.5,()=>this.setState({RX:true,M:res.resource.data})):Toast.offline('商品暂未开放，敬请期待',1.5);
  }
  handleClickTitleFor(){
    this.setState({RX:false})
  }
  // handleC=(e)=>{
  //
  //   this.state.R===[]?this.setState({RX:true}):this.setState({RX:!this.state.RX});
  //
  //
  // };
  async handleLink(productId){
    const data=await user.taoBID({productId});
    window.location.href=data.data.coupon_short_url;
  }
  render() {
    const {T}=this.state.T.length>0?this.state.T:'';
    const {location}=this.props;
    return (
      <div className={styles.recordBox}>
        <Header title='淘宝列表' img={img} image={require('../../assets/images/jiantou.png')}/>
        <WhiteSpace/>
        <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} className={ys}>
          <div>
            <div className={styles.allDiv} style={{display:this.state.RX?'flex':'none'}} onClick={this.handleClickTitle.bind(this)}>
              <p>美妆</p><p>女装</p><p>男装</p><p>家具</p>
              <p>数码</p><p>鞋包</p><p>内衣</p><p>运动</p>
              <p>食品</p><p>母婴</p>
            </div>
            {
              this.state.R!==[]?this.state.R.map((item,index)=>(
                <div className={styles.goodItem} key={index} >
                  <div className={styles.imgBox}>
                    <img src={item.pict_url} alt=""/>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.name}>{item.title}</p>
                    <p className={styles.other}>{item.item_description}</p>
                    <p className={styles.other}><span className={styles.UL}>原价：¥{item.zk_final_price}</span><span onClick={this.handleLink.bind(this,item.num_iid)} className={styles.JU}>劵：{(parseFloat(((item.coupon_info).substring(item.coupon_info.length-3))))}</span></p>
                    <p className={styles.prcie}><span style={{fontSize:'.22rem',color:"#999"}}>券后价</span><span>¥{Math.round(parseFloat((item.zk_final_price*1-getConput(item.coupon_info))*100))/100}</span><span style={{fontSize:'.22rem',color:"#999",marginLeft:'.15rem'}}>奖励：</span><span  style={{fontSize:'.22rem'}}>{Math.round(parseFloat(((item.zk_final_price*1-getConput(item.coupon_info))*item.max_commission_rate/100)*100))/100}</span></p>
                  </div>
                </div>
              )):''
            }


          </div>

          <div>
            <div className={styles.allDiv} style={{display:this.state.RX?'flex':'none'}} onClick={this.handleClickTitleTwo.bind(this)}>
              <p>美妆</p><p>女装</p><p>男装</p><p>家具</p>
              <p>数码</p><p>鞋包</p><p>内衣</p><p>运动</p>
              <p>食品</p><p>母婴</p>
            </div>
            {
              this.state.R!==[]?this.state.R.map((item,index)=>(
                <div className={styles.goodItem} key={index}>
                  <div className={styles.imgBox}>
                    <img src={item.pict_url} alt=""/>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.name}>{item.title}</p>
                    <p className={styles.other}>{item.item_description}</p>
                    <p className={styles.other}><span className={styles.UL}>原价：¥{item.zk_final_price}</span><span onClick={this.handleLink.bind(this,item.num_iid)} className={styles.JU}>劵：{(parseFloat(((item.coupon_info).substring(item.coupon_info.length-3))))}</span></p>
                    <p className={styles.prcie}><span style={{fontSize:'.22rem',color:"#999"}}>券后价</span><span>¥{Math.round(parseFloat((item.zk_final_price*1-getConput(item.coupon_info))*100))/100}</span><span style={{fontSize:'.22rem',color:"#999",marginLeft:'.15rem'}}>奖励：</span><span  style={{fontSize:'.22rem'}}>{Math.round(parseFloat(((item.zk_final_price*1-getConput(item.coupon_info))*item.max_commission_rate/100)*100))/100}</span></p>
                  </div>
                </div>
              )):''
            }
          </div>

          <div>
            <div className={styles.allDiv} style={{display:this.state.MX?'flex':'none'}} onClick={this.handleClickTitleTre.bind(this)}>
              <p>备孕</p><p>0至6个月</p><p>7至12个月</p><p>1至3岁</p>
              <p>4至6岁</p><p>7至12岁</p>
            </div>
            {
              (this.state.M!==[])?this.state.M.map((item,index)=>(
                <div className={styles.goodItem} key={index}>
                  <div className={styles.imgBox}>
                    <img src={item.pict_url} alt=""/>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.name}>{item.title}</p>
                    <p className={styles.other}>{item.item_description}</p>
                    <p className={styles.other}><span className={styles.UL}>原价：¥{item.zk_final_price}</span><span onClick={this.handleLink.bind(this,item.num_iid)} className={styles.JU}>劵：{(parseFloat(((item.coupon_info).substring(item.coupon_info.length-3))))}</span></p>
                    <p className={styles.prcie}><span style={{fontSize:'.22rem',color:"#999"}}>券后价</span><span>¥{Math.round(parseFloat((item.zk_final_price*1-getConput(item.coupon_info))*100))/100}</span><span style={{fontSize:'.22rem',color:"#999",marginLeft:'.15rem'}}>奖励：</span><span  style={{fontSize:'.22rem'}}>{Math.round(parseFloat(((item.zk_final_price*1-getConput(item.coupon_info))*item.max_commission_rate/100)*100))/100}</span></p>
                  </div>
                </div>
              )):''
            }
          </div>
          <div>
            <div className={styles.allDiv}  onClick={this.handleClickTitleFor.bind(this)}>
              {
               this.state.T.length>0? this.state.T.map((item,index)=>(
                  <div className={styles.goodItem} key={index} >
                    <div className={styles.imgBox}>
                      <img src={item.pict_url} alt=""/>
                    </div>
                    <div className={styles.info}>
                      <p className={styles.name}>{item.title}</p>
                      <p className={styles.other}>{item.item_description}</p>
                      <p className={styles.other}><span className={styles.UL}>原价：¥{item.zk_final_price}</span><span onClick={this.handleLink.bind(this,item.num_iid)} className={styles.JU}>劵：{(parseFloat(((item.coupon_info).substring(item.coupon_info.length-3))))}</span></p>
                      <p className={styles.prcie}><span style={{fontSize:'.22rem',color:"#999"}}>券后价</span><span>¥{Math.round(parseFloat((item.zk_final_price*1-getConput(item.coupon_info))*100))/100}</span><span style={{fontSize:'.22rem',color:"#999",marginLeft:'.15rem'}}>奖励：</span><span  style={{fontSize:'.22rem'}}>{Math.round(parseFloat(((item.zk_final_price*1-getConput(item.coupon_info))*item.max_commission_rate/100)*100))/100}</span></p>
                    </div>
                  </div>
                )):''
              }
            </div>
          </div>
        </Tabs>
        <WhiteSpace/>
      </div>
    )
  }
}
