import React, {Component} from 'react';
import Header from "../../Common/Header/Header";
import styles from './NeverUp.less';
import * as user from "../../services/user";
import {Toast} from 'antd-mobile';
function kingcwt(str) {
  if(str.match(/\d+/g)[1]=='00') return str.match(/\d+/g)[2];
    return str.match(/\d+/g)[1];
}

export default class NeverUp extends Component {
  constructor() {
    super();
    this.state = {type: 'tj', Arr: []}
  }

  handleEvent(ev) {
    this.setState({type: ev.type});
  }

  async componentDidMount() {
    /*特价*/
    const res = await user.taoBao({page: 1, size: 20, topcate: '特价'});
    res.resource.data?Toast.loading('正在加载',1.5,()=> this.setState({Arr: res.resource.data, type: ''})):Toast.offline('商品暂未开发 尽情期待！',1.5);
  }

  async handleLink(productId) {
    const data = await user.taoBID({productId});
    window.location.href = data.data.coupon_short_url;
  }

  async handleMYEvent(e) {
    /*母婴*/
    var reg = /^(<p>)/;
    if (reg.test(e.target.innerHTML)) return;
    else {
      const MYData = await user.taoBao({page: 1, size: 20, topcate: '母婴', subcate: e.target.innerHTML});
      MYData.resource.data?Toast.loading('正在加载',1.5,()=> this.setState({Arr: MYData.resource.data, type: ''})):Toast.offline('商品暂未开发 尽情期待！',1.5);

    }
  }

  async handleYZPEvent(e) {
    /*优质品*/
    var reg = /^(<p>)/;
    if (reg.test(e.target.innerHTML)) return;
    else {
      const MYData = await user.taoBao({page: 1, size: 20, topcate: '优质品', subcate: e.target.innerHTML});
      MYData.resource.data?Toast.loading('正在加载',1.5,()=> this.setState({Arr: MYData.resource.data, type: ''})):Toast.offline('商品暂未开发 尽情期待！',1.5);
    }
  }
  async handleRXEvent(e) {
    /*热销*/
    var reg = /^(<p>)/;
    if (reg.test(e.target.innerHTML)) return;
    else {
      const MYData = await user.taoBao({page: 1, size: 20, topcate: '热销', subcate: e.target.innerHTML});
      console.log(MYData);
      MYData.resource.data?Toast.loading('正在加载',1.5,()=> this.setState({Arr: MYData.resource.data, type: ''})):Toast.offline('商品暂未开发 尽情期待！',1.5);
    }
  }
  async handleData(data){
    let Arr=data.result_list?data.result_list:'';
    Toast.loading('正在加载',1.5,()=> this.setState({Arr}));
  }
  render() {
    console.log(this.state.Arr,'数据--');

    return (
      <div className={styles.NEV}>
        <Header  handleData={this.handleData.bind(this)} Search={true}  qd='确定' image={require('../../assets/images/jiantou.png')}/>
        <div className={styles.CONTAINER}>
          <div className={styles.HeadTab} onClick={e => this.handleEvent(e.target.dataset)}>
            <button data-type="rx" className={this.state.type === 'rx' ? styles.active : ''} onClick={this.cc}>热销
            </button>
            <button data-type="yzp" className={this.state.type === 'yzp' ? styles.active : ''}>优质品</button>
            <button data-type="my" className={this.state.type === 'my' ? styles.active : ''}>母婴</button>
            <button data-type="tj" className={this.state.type === 'tj' ? styles.active : ''}>特价</button>
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
          <div style={{marginTop: '.15rem'}}>
            {
              this.state.Arr !== [] ? this.state.Arr.map((item, index) => (
                <div className={styles.goodItem} key={index}>
                  <div className={styles.imgBox}>
                    <img src={item.pict_url} alt=""/>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.name}>{item.title}</p>
                    <p className={styles.other}>{item.item_description}</p>
                    <p style={{cursor:'pointer'}} className={styles.other}><span className={styles.UL}>原价：¥{item.zk_final_price}</span><span
                      onClick={this.handleLink.bind(this, item.num_iid)}
                      className={styles.JU}>劵：{item.coupon_info?kingcwt(item.coupon_info):''}</span>
                    </p>
                    <p className={styles.prcie}><span style={{
                      fontSize: '.22rem',
                      color: "#999"
                    }}>券后价</span><span>¥{Math.round(parseFloat((item.zk_final_price * 1 - (item.coupon_info!==''?kingcwt(item.coupon_info):0)) * 100)) / 100}</span><span
                      style={{fontSize: '.22rem', color: "#999", marginLeft: '.15rem'}}>奖励：</span><span
                      style={{fontSize: '.22rem'}}>{Math.round(parseFloat(((item.zk_final_price * 1 - (item.coupon_info?kingcwt(item.coupon_info):0)) *( item.max_commission_rate?item.max_commission_rate:1) / 100) * 100)) / 100}</span>
                    </p>
                  </div>
                </div>
              )) : ''
            }
          </div>
        </div>
      </div>
    )
  }
}
