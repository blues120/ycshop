import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/goodDetail.less";
import { Button,Toast,Icon,WhiteSpace,List,InputItem,Modal,Stepper,Carousel} from 'antd-mobile';
import * as fetch from '../services/shop';
import DoubleBtn from '../components/DoubleBtn';
import good01 from '../assets/images/good01.png';
import CloseIcon from '../assets/icon/CloseIcon.png';
import Kefu from '../assets/icon/Kefu.png';
import SnapUpIcon from '../assets/icon/SnapUp.png';
import person from '../assets/icon/person.jpg';
import star_gray from '../assets/icon/star_gray.png';
import star_red from '../assets/icon/star_red.png';
const Item=List.Item;
function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }
@connect(state => ({shopData: state.shop}))
export default class GoodDetail extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            propModal:false,
            num:1,
            selected:[],
            s_oldPrice:[],
            price:0,
            stock:0,
            selectedStr:''
        };
    }

    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
          [key]: true,
        });
    }
    onClose = key => () => {
    this.setState({
        [key]: false,
    });
    }

    onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
        return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
        e.preventDefault();
    }
    }


    //
    componentWillMount(){
        const {shopData}=this.props;
        let goodDetail=shopData.goodDetail;
        if(goodDetail.specifications){
            let selected=[];
            goodDetail.specifications.map((i,index)=>{
                let item={name:i.goodsPropertyCategoryName,value:i.goodsPropertyList[0].goodsPropertyName};
                selected.push(item);
            })
            this.setState({selected},()=>{this.getPrice()})
        }

    }
    //
    componentWillReceiveProps(nextProps){
        const {shopData}=nextProps;
        let goodDetail=shopData.goodDetail;
        if(goodDetail.specifications){
            let selected=[];
            goodDetail.specifications.map((i,index)=>{
                let item={name:i.goodsPropertyCategoryName,value:i.goodsPropertyList[0].goodsPropertyName};
                selected.push(item);
            })
            this.setState({selected},()=>{this.getPrice()})
        }

    }
    // 更改规格
    chgProp(index,value){
        let {selected}=this.state;
        selected[index].value=value;
        let selectedStr='';
        this.setState({selected},()=>{this.getPrice()});
    }
    // 更改数量
    chgNum=(num)=>{
        this.setState({num},()=>{this.getPrice()});
    }

    // 计算价格
    getPrice(){
        const {history,dispatch,shopData}=this.props;
        const {num,propModal,selected}=this.state;
        let goodDetail=shopData.goodDetail;
        let selectedStr='';
        selected.map((i,index)=>{
            selectedStr+=i.name+':'+i.value;
            if(index!==selected.length-1){
                selectedStr+=',';
            }
        })
        this.setState({selectedStr})
        // 对比商品价格模版确定价格
        goodDetail.model.map((i,index)=>{
            if(i.propertyCombination==selectedStr){
                this.setState({price:Number(i.propertyPrice),s_oldPrice:i.propertyOriginalPrice,stock:Number(i.propertyStock)})
            }
        })

    }

    // 加入购物车
    async addCart(){
        const {dispatch,shopData}=this.props;
        let goodDetail=shopData.goodDetail;
        const {num,propModal,selected,price,stock,selectedStr}=this.state;

        let sql={goodsId:goodDetail._id,number:num,type:selectedStr,selectType:true}
        const value=await fetch.addCart(sql);
        if(value.status){
            Toast.success(value.message,2);
        }else{
            Toast.fail(value.message,2);
        }
    }

    // 立即购买
    async buyNow(){
        const {dispatch,shopData}=this.props;
        let goodDetail=shopData.goodDetail;

        const {num,propModal,selected,price,stock,selectedStr}=this.state;
        let type={};
        goodDetail.model.map((i,index)=>{
            if(i.propertyCombination==selectedStr){
                type=i;
            }
        })
        let goods=goodDetail;
        let sql={storeGoods:[{goods,goodsId:goodDetail._id,number:num,type,selectType:true}]}
        const value=await fetch.saveOrder(sql);
        if(value.status){
            Toast.success(value.message,2,()=>{
                dispatch(routerRedux.push('/confirmorder'))
            });
        }else{
            Toast.fail(value.message,2);
        }
    }



    // 收藏

    async collection(goodsId,goodsName,goodsImg,state){
        const {dispatch}=this.props;

        const value=await fetch.collection({goodsId,goodsName,goodsImg,state:0});
        let str='';
        if(state){str='添加'}else{str='取消'}
        if(value.status){
            Toast.success(str+'收藏成功',2);
            dispatch({
                type:'shop/getUser',
                payload:{
                    checkCollection:state
                }
            })
        }else{
            Toast.fail(str+'收藏成功',2);
        }
    }

    render() {
        const {history,dispatch,shopData}=this.props;
        const {num,propModal,selected,price,stock,s_oldPrice}=this.state;
        let goodDetail=shopData.goodDetail;
        let checkCollection=shopData.checkCollection;

        console.log(goodDetail,'@@');
        let systemConfig=shopData.systemConfig;
        let reviewList=shopData.reviewList;
        let reviewTotal=shopData.pagination.total;
        const _this=this;
        const DoubleBtnProps={
            btnWidth:250,
            btnHeight:80,
            leftContent:'加入购物车',
            leftBackground:'#FFD3E2',
            leftColor:'#FE4274',
            leftTap(){
                _this.addCart();
            },
            rightContent:'立即购买',
            rightBackground:'#FE4274',
            rightColor:'#FFFFFF',
            rightTap(){
                _this.buyNow();
            },
        }
        return (
            <div className={styles.rootBox}>
                {
                    goodDetail._id?
                    <div className={styles.main}>
                        {/* 头部图片 */}
                        <div className={styles.header}>
                            {/* 轮播 */}
                            <Carousel
                                autoplay={false}
                                infinite
                            >
                                {goodDetail.multiple.map((i,index) => (
                                    <div
                                    key={index}
                                    style={{ display: 'inline-block', width: '100%', height: '100vw'}}
                                    >
                                        <img
                                            src={APIHost+i}
                                            alt=""
                                            style={{ width: '100%', height: '100vw',  verticalAlign: 'top' }}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                            {/* 头部导航 */}
                            <div className={styles.topIcon}>
                                <span onClick={()=>history.goBack()}></span>
                                <span onClick={()=>history.push('/cart')}></span>
                            </div>
                            {/* 当为秒杀时显示的横幅 */}
                            {
                                false?
                                <div className={styles.Countdown}>
                                    <div className={styles.SnapUpIcon}>
                                        <img src={SnapUpIcon} alt=""/>
                                        <span>疯狂 快抢</span>
                                    </div>
                                    {/* 结束倒计时 */}
                                    <div className={styles.SnapUpTime}>
                                        <p>距离结束仅剩</p>
                                        <p><span>00</span>天<span>00</span>天<span>00</span>天<span>00</span>天</p>
                                    </div>
                                </div>
                                :
                                ''
                            }
                        </div>
                        {/* 留白 */}
                        <WhiteSpace size='xs'></WhiteSpace>
                        {/* 商品基础信息 */}
                        <div className={styles.goodInfo}>

                            <p className={styles.price}>¥{Math.round(parseFloat((price-goodDetail.availableIntegral+goodDetail.originalIntegral*systemConfig.ysjfDKRate)*100))/100} <span>抵扣价</span><span>(使用积分后)</span><span>赠送{goodDetail.returnYSjifen*100}%</span></p>
                            <p className={styles.oldPrice}>当前价：<span>{price}</span>原价：<span>{s_oldPrice}</span>销量：<span>{goodDetail.sales}</span></p>
                            {/* <p className={styles.jifen}>
                                原价
                                <span>{goodDetail.availableIntegral+goodDetail.originalIntegral*systemConfig.ysjfDKRate}元</span>
                            </p> */}
                            <p className={styles.name}>
                                {goodDetail.name}
                            </p>

                        </div>
                        {/* 留白 */}
                        <WhiteSpace size='md'></WhiteSpace>
                        {/* 商品属性 */}
                        <List className={styles.goodProp}>
                            <Item onClick={this.showModal('propModal')} thumb={<span className={styles.itemThumb}>数量</span>} arrow="horizontal">{num}</Item>
                            {
                                goodDetail.specifications.map((i,index)=>{
                                    return(
                                        <Item key={index} onClick={this.showModal('propModal')} thumb={<span className={styles.itemThumb}>{selected.length>1?selected[index].name:''}</span>} arrow="horizontal">{selected.length>1?selected[index].value:''}</Item>
                                    )
                                })
                            }

                        </List>
                        {/* 留白 */}
                        <WhiteSpace size='md'></WhiteSpace>
                        {/* 店铺信息 */}
                        <div className={styles.shopInfo}>
                            <span className={styles.shopIcon}><img src={APIHost+goodDetail.merchatInfo.merchant_logo} alt=""/></span>
                            <span className={styles.shopName}>{goodDetail.merchatInfo.merchant_name}</span>
                            {/* <span className={styles.shopEnter}>进店</span> */}
                            <Button className={styles.shopEnter} type='ghost' size='small' onClick={()=>history.push('/shop?_id='+goodDetail.merchatInfo._id)} >进店</Button>
                        </div>
                        {/* 留白 */}
                        <WhiteSpace size='md'></WhiteSpace>

                        {/* 商品评价 */}
                        {
                            reviewTotal===0||reviewList.length===0?
                            <div className={styles.review}>
                                <p className={styles.noReview}>本商品暂无评价</p>
                            </div>
                            :
                            <div className={styles.review}>
                                <p className={styles.title}><span>商品评价({reviewTotal})</span><span onClick={()=>history.push('/reviewlist?_id='+goodDetail._id)} >查看全部></span></p>
                                <p className={styles.name}><span><img src={reviewList[0].headImg===null?person:APIHost+reviewList[0].headImg} alt=""/></span>{reviewList[0].name[0]+'***'}</p>
                                <p className={styles.body}>{reviewList[0].message}</p>
                            </div>

                        }



                        {/* 留白 */}
                        <WhiteSpace size='md'></WhiteSpace>


                        {/* 商品详情 */}
                        <div className={styles.goodDetail}>
                            <p>
                                商品详情
                            </p>
                            <div dangerouslySetInnerHTML={{__html:goodDetail.describe?goodDetail.describe:''}} >

                            </div>
                        </div>

                        {/* 底部Tab */}
                        <div className={styles.tab}>
                            <div className={styles.tabLeft}>
                                <div onClick={()=>history.push('/message')}>
                                    <img src={Kefu} alt=""/>
                                    <span>客服</span>
                                </div>
                                <div onClick={()=>this.collection(goodDetail._id,goodDetail.name,goodDetail.cover,!checkCollection)}>
                                    <img src={checkCollection?star_red:star_gray} alt=""/>
                                    <span  className={checkCollection?styles.cActive:''} >{checkCollection?'收藏':'收藏'}</span>
                                </div>
                            </div>
                            {/* 按钮组件 */}
                            <DoubleBtn {...DoubleBtnProps} />
                        </div>

                    </div>
                    :
                    ''
                }

                {/* 选择属性弹窗 */}
                {
                    goodDetail.specifications?
                    <Modal
                        popup
                        visible={propModal}
                        onClose={this.onClose('propModal')}
                        animationType="slide-up"
                    >
                        {/* 弹窗内容 */}
                        <div className={styles.modalBox}>
                            {/* 商品图和信息 */}
                            <div className={styles.goodInfo2}>
                                <img src={APIHost+goodDetail.cover} alt=""/>
                                <div>
                                    <p className={styles.price}>¥{Math.round(parseFloat((price-goodDetail.availableIntegral+goodDetail.originalIntegral*systemConfig.ysjfDKRate)*100))/100} <span>抵扣价</span><span>(使用积分后)</span></p>
                                    <p>库存{stock}</p>
                                    <p>请选择尺码</p>
                                </div>
                            </div>
                            {/* 商品属性 */}
                            {
                                goodDetail.specifications.map((i,index)=>{
                                    return(
                                        <div key={index} className={styles.propItem}>
                                            <p>{i.goodsPropertyCategoryName}</p>
                                            <div>
                                                {
                                                    i.goodsPropertyList.map((item,_index)=>{
                                                        {/* <span className={styles.active}>黄色</span> */}
                                                        return(
                                                            <span key={_index}  className={selected.length>1?selected[index].value===item.goodsPropertyName?styles.active:'':''} onClick={()=>this.chgProp(index,item.goodsPropertyName)} >{item.goodsPropertyName}</span>

                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }

                            {/* 数量更改 */}
                            <List className={styles.numBox}>
                                <Item
                                    wrap
                                    extra={
                                        <Stepper
                                            style={{ width: '100%', minWidth: '100px' }}
                                            showNumber
                                            max={99}
                                            min={1}
                                            value={num}
                                            onChange={this.chgNum}
                                        />}
                                >
                                    更改数量
                                </Item>
                            </List>

                            {/* 确定按钮 */}
                            <div className={styles.addBtnBox}>
                                <Button type='primary' onClick={this.onClose('propModal')}>保存</Button>
                            </div>
                        </div>
                    </Modal>
                    :
                    ''
                }
            </div>
        )
    }
}
