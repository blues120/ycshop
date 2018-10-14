import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/cart.less";
import { Button,Toast,Checkbox,Stepper} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
@connect(state => ({shopData: state.shop}))
export default class Cart extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            selectedTabBar:'cart',
            cartList:[],
            price:0
        };
    }


    // 
    componentWillMount(){
        const {shopData}=this.props;
        let cartList=shopData.cartList;
        if(cartList.length>0){
            this.setState({
                cartList
            },()=>{
                this.getPrice()
            })
        }
        
    }
    // 
    componentWillReceiveProps(nextProps){
        const {shopData}=nextProps;
        let cartList=shopData.cartList;
        if(cartList.length>0){
            this.setState({
                cartList
            },()=>{
                this.getPrice()
            })
        }
        
    }

    // 删除购物车的商品
    async deleteGood(_id,index){
        const {dispatch,shopData}=this.props;
        let {cartList}=this.state;
        const value= await fetch.deleteCart({list:[_id]});
        if(value.status){
            Toast.success(value.message,2);
            cartList.splice(index,1);
            this.setState({cartList})
        }else{
            Toast.fail(value.message,2);
        }
        // if(value.status){
        //     Toast.success(value.message,2);
        //     dispatch({
        //         type:'shop/deleteCart',
        //         payload:{
        //             index
        //         }
        //     })
        // }else{
        //     Toast.fail(value.message,2);
        // }
    }

    // 变更购物车选中状态
    chgChecked(e,index){
        let {cartList}=this.state;
        cartList[index].selectType=e.target.checked;
        this.setState({
            cartList
        },()=>{
            this.getPrice()
        })
    }

    // 全选和全不选
    chgCheckedAll(e){
        let {cartList}=this.state;
        cartList.map((i,index)=>{
            cartList[index].selectType=e.target.checked;
        })
        this.setState({
            cartList
        },()=>{
            this.getPrice()
        })
    }
    // 更改数量
    async chgNum(num,index){
        let {cartList}=this.state;
        cartList[index].number=num;
        if(num>Number(cartList[index].type.propertyStock)){
            Toast.offline('数量不能超过库存!',2);
            return;
        }
        this.setState({
            cartList
        },()=>{
            this.getPrice()
        })
        let _id=cartList[index]._id;
        let number=num;
        const value=await fetch.updateCart({_id,number});
    }
    // 计算价格
    getPrice(){
        let {cartList}=this.state;
        let num=0;
        cartList.map((i,index)=>{
            if(i.selectType){
                num+=Math.round(parseFloat((i.number*Number(i.type.propertyPrice))*100))/100
            }
        })
        this.setState({
            price:num
        })
        
    }

    // 提交信息生成订单
    async goSubmit(){
        const {dispatch}=this.props;
        let {cartList}=this.state;
        let newArr=[];
        cartList.map((i,index)=>{
            if(i.selectType){
                newArr.push(i)
            }
        })
        const value=await fetch.saveOrder({storeGoods:newArr});
        if(value.status){
            Toast.success('提交成功!',2,()=>{
                dispatch(routerRedux.push('/confirmorder'))
            })
        }else{
            Toast.fail(value.message,2);
        }
    }
    render() {
        const {history,dispatch,shopData}=this.props;
        const {cartList,price}=this.state;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.goBack())
            },
            titleName:"购物车",
        }
        // 传入tabBar参数
        const tabBarProps = {
            selectedTabBar: this.state.selectedTabBar,
            history
        }
        
        return (
            <div className={styles.rootBox}>
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>
                {/*底部标签栏*/}
                <MyTabBar {...tabBarProps}/>

                <div className={styles.main}>
                    {/* 商品 */}
                    {
                        cartList.map((i,index)=>{
                            return(
                                <div key={index} className={styles.goodItem}>
                                    <span className={styles.checkBox}><Checkbox checked={i.selectType} onChange={(e)=>this.chgChecked(e,index)} /></span>
                                    <div className={styles.imgBox}>
                                        <img src={APIHost+i.goods.cover} alt=""/>
                                    </div>
                                    <div className={styles.propBox}>
                                        <p className={styles.name}>{i.goods.name}</p>
                                        <p className={styles.prop}>{i.type.propertyCombination}</p>
                                        <p className={styles.price}>¥{Number(i.type.propertyPrice).toFixed(2)}</p>
                                        <div className={styles.stepper}>
                                            <Stepper
                                                style={{maxWidth:'2rem'}}
                                                showNumber
                                                max={999}
                                                min={1}
                                                value={i.number}
                                                onChange={(num)=>this.chgNum(num,index)}
                                            />
                                            <span>
                                                <Button type='ghost' size='small' onClick={()=>this.deleteGood(i._id,index)} >删除</Button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    
                   

                    {/* 下部购买和总价 */}
                    <div className={styles.totalBox}>
                        <div className={styles.all}>
                            <Checkbox defaultChecked={true} onChange={(e)=>this.chgCheckedAll(e)} />
                            <span>全选</span>
                        </div>
                        <div className={styles.price}>
                            合计：
                            <span>¥{price}</span>
                        </div>
                        <div className={styles.btn}>
                            <Button type='primary' onClick={()=>this.goSubmit()} >结算</Button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
