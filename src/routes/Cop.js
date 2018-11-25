import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/confirmOrder.less";
import {Button, Toast, WhiteSpace, List, InputItem} from 'antd-mobile';
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import addressIcon from '../assets/icon/address.png';
import rightIcon from '../assets/icon/rightIcon.png';

const Item = List.Item;
@connect(state => ({shopData: state.shop}))
export default class Cop extends Component {

  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      price: '',
      goodsList: [],
      activeState: ''
    };
  }

  // 按钮的disabled属性更改
  chgDisabled(disabled) {
    this.setState({disabled})
  }

  // 前往地址页面
  goAddr() {
    const {dispatch} = this.props;
    dispatch(routerRedux.push('/myaddr?type=1&index=1'))
  }
  // 计算价格
  componentDidMount() {

    const {shopData} = this.props;
    let temporaryOrder = shopData.temporaryOrder;
    if (temporaryOrder.store) {
      let num = 0;
      temporaryOrder.store.map((i, index) => {
        let total = Math.round(parseFloat(Number(i.type.propertyPrice) * i.number * 100)) / 100;
        temporaryOrder.store[index].total = total;
        num += total;
      });
      // console.log(num,'没问题啊？');
      this.setState({
        price: num,
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    const {shopData} = nextProps;
    let temporaryOrder = shopData.temporaryOrder;
    if (temporaryOrder.store) {
      let num = 0;
      temporaryOrder.store.map((i, index) => {
        let total = Math.round(parseFloat(Number(i.type.propertyPrice) * i.number * 100)) / 100;
        temporaryOrder.store[index].total = total;
        num += total;
      });
      this.setState({
        price: num,
        goodsList: temporaryOrder.store,
        activeState: 0
      })
    } else if (temporaryOrder.store && temporaryOrder.store.length > 1) {
      this.setState({
        price: temporaryOrder.store ? temporaryOrder.store[0].eckill.price : '', activeState: 1,
        goodsList: [{
          goodsId: temporaryOrder.store ? temporaryOrder.store[0]._id : '',
          selectType: true,
          total: temporaryOrder.store ? temporaryOrder.store[0].eckill.price : '',
          type: {},
          number: 1
        }]
      })
    }
  }
  // 添加订单

  async addOrder() {

    this.chgDisabled(true);
    const {history, dispatch, shopData} = this.props;
    let addrDetail = shopData.addrDetail;
    let temporaryOrder = shopData.temporaryOrder;
    const {price, goodsList} = this.state;
    if (!addrDetail._id) {
      Toast.offline('请选择地址!', 2);
      this.chgDisabled(false);
      return;
    }
    let userName = addrDetail.recipient;
    let address = addrDetail;
    let userTelephone = addrDetail.telephone;
    let payable = price;
    let paid = price;
    let shipping = 1;
    if(temporaryOrder.store) {
/*--*/
      const value = await fetch.copaddOrder({
        goodsList,
        userName,
        address,
        userTelephone,
        payable,
        paid,
        shipping,
        // activeState: this.state.activeState
      });
      if (value.status) {
        Toast.success(value.message, 2, () => {
          dispatch(routerRedux.push('/mine'))
        })
      } else {
        Toast.fail(value.message, 2, () => {
          this.chgDisabled(false)
        })
      }
    }
    // (temporaryOrder.store && temporaryOrder.store.length > 1)
    else{
      const value = await fetch.addOrder({
        goodsList,
        userName: temporaryOrder.store ? temporaryOrder.store[0].name : '',
        address: shopData.addrDetail,
        userTelephone: '111111111',
        payable: temporaryOrder.store ? temporaryOrder.store[0].eckill.price : '',
        paid: temporaryOrder.store ? temporaryOrder.store[0].eckill.price : '',
        shipping: 1,
        activeState: this.state.activeState
      });
      if (value.status) {
        Toast.success(value.message, 2, () => {
          dispatch(routerRedux.push('/payorder?_id=' + value.resource._id))
        })
      } else {
        Toast.fail(value.message, 2, () => {
          this.chgDisabled(false)
        })
      }
    }


  }

  render() {
    const {history, dispatch, shopData} = this.props;
    const {disabled, price} = this.state;
    let temporaryOrder = shopData.temporaryOrder;
    let addrDetail = shopData.addrDetail;
    // 传入navbBar参数
    const navBarProps = {
      leftVisible: true,
      leftFunc() {
        dispatch(routerRedux.goBack())
      },
      titleName: '确认订单',
    };

    return (
      <div className={styles.rootBox}>
        {/*头部导航栏*/}
        <MyNavBar {...navBarProps}/>
        {/*底部标签栏*/}
        <div className={styles.main}>
          {/* 头部地址,选择地址 */}
          <div className={styles.address}>
                        <span>
                            <img src={addressIcon} alt=""/>
                        </span>
            {
              addrDetail._id ?
                <div onClick={() => this.goAddr()}>
                  <p className={styles.info}><span>收货人：{addrDetail.recipient}</span><span>{addrDetail.telephone}</span>
                  </p>
                  <p
                    className={styles.addr}>收货地址：{addrDetail.province + addrDetail.city + addrDetail.area + addrDetail.address}</p>
                </div>
                :
                <div onClick={() => this.goAddr()}>
                  <p className={styles.selectAddr}>点击选择地址</p>
                </div>
            }

            <span>
                            <img src={rightIcon} alt=""/>
                        </span>
          </div>


          <WhiteSpace size='sm'></WhiteSpace>
          {/* <List>
                        <Item extra={899}>我的可用积分</Item>
                        <Item extra={899}>我的可用积分</Item>
                    </List>
                    <WhiteSpace size='sm'></WhiteSpace> */}
          {/* 订单商品 */}
          {
            temporaryOrder.store?
              temporaryOrder.store.map((i, index) => {
                return (
                  <div key={index} className={styles.goodItem}>
                    <div className={styles.itemLeft}>
                      <img src={temporaryOrder.store ? (APIHost+i.goods.multiple[0]) : ''} alt=""/>
                    </div>
                    <div className={styles.itemRight}>
                      <p className={styles.name}>{i.goods.name}</p>
                      <p className={styles.prop}>{i.type.propertyCombination}</p>
                      <p className={styles.price}>¥{Number(i.type.propertyPrice).toFixed(2)}</p>
                      <p className={styles.num}>X{i.number}</p>
                    </div>
                  </div>
                )
              })
              : temporaryOrder.store && temporaryOrder.store.length > 1 ? (
                <div className={styles.goodItem}>
                  <div className={styles.itemLeft}>
                    <img src={temporaryOrder.store ? (APIHost + temporaryOrder.store[0].multiple[0]) : ''} alt=""/>
                  </div>
                  <div className={styles.itemRight}>
                    <p className={styles.name}>{temporaryOrder.store ? temporaryOrder.store[0].name : ''}</p>
                    <p className={styles.prop}>{temporaryOrder.store ? temporaryOrder.store[0].name : ''}</p>
                    <p className={styles.price}>¥{temporaryOrder.store ? temporaryOrder.store[0].eckill.price : ''}</p>
                    <p className={styles.num}>X1</p>
                  </div>
                </div>
              ) : ''

          }
          {/* orderbtn */}
          <div className={styles.tabBar}>
            <div className={styles.total}>
              合计金额：<span>¥{this.state.price?this.state.price:price}</span>
            </div>
            <div className={styles.btnBox}>
              <Button type='primary' disabled={disabled} loading={disabled}
                      onClick={() => this.addOrder()}>立即兑换</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
