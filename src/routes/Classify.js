import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/classify.less";
import { Button,Toast,SearchBar ,Icon} from 'antd-mobile';
import * as fetch from '../services/shop';
import good01 from '../assets/images/good01.png';
@connect(state => ({shopData: state.shop}))
export default class Classify extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex:0
        };
    }

    getDetail(selectedIndex){
        this.setState({
            selectedIndex
        })
    }
    render() {
        const {history,dispatch,shopData}=this.props; 
        const{selectedIndex}=this.state;
        let classify=shopData.classify;
        return (
            <div className={styles.rootBox}>
                <style>
                    {
                        `
                        .am-search-synthetic-ph{
                            display:none !important;
                        }

                        `
                    }
                </style>

                {/* 头部搜索和返回 */}
                <div className={styles.searchBar}>
                    <div onClick={()=>history.goBack()}>
                        <Icon type='left' size='lg' color='#FFFFFF' /> 
                    </div>
                    <SearchBar placeholder="搜索" onSubmit={(val)=>history.push('/goodlist?keyword='+val)} />
                </div>
                {/* 下面的列表 */}
                <div className={styles.main}>
                    {/* 左边的一级分类 */}
                    <div className={styles.leftBox}>
                        <div className={styles.menuList}>
                            {
                                classify.map((i,index)=>{
                                    return(
                                        <span key={index} className={selectedIndex==index?styles.active:''} onClick={()=>this.getDetail(index)} >{i.name}</span>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {/* 右边的二级分类 */}
                    <div className={styles.rightBox}>
                        <div className={styles.classifyList}>
                            <div className={styles.listContent}>
                                {/* 子项 */}
                                {
                                    classify.length>0&&classify[selectedIndex].children?
                                    classify[selectedIndex].children.map((i,index)=>(
                                        <div key={index} className={styles.itemBox}>
                                            <div className={styles.item} onClick={()=>history.push('/goodlist?_id='+i._id)} >
                                                <div>
                                                    <img src={APIHost+i.icon} alt=""/>
                                                </div>
                                                <p>{i.name}</p>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    '' 
                                }
                                




                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
