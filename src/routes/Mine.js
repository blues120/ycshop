import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/mine.less";
import { Button,Toast} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import * as fetch from '../services/shop';
import DoubleBtn from '../components/DoubleBtn';
import mineIcon01 from '../assets/icon/mineIcon01.png';
import mineIcon02 from '../assets/icon/mineIcon02.png';
import mineIcon03 from '../assets/icon/mineIcon03.png';
import mineIcon04 from '../assets/icon/mineIcon04.png';
import mineIcon05 from '../assets/icon/mineIcon05.png';
import mineIcon06 from '../assets/icon/mineIcon06.png';
import mineIcon07 from '../assets/icon/mineIcon07.png';
import mineIcon08 from '../assets/icon/mineIcon08.png';
import mineIcon09 from '../assets/icon/mineIcon09.png';
import mineIcon10 from '../assets/icon/mineIcon10.png';
import mineIcon11 from '../assets/icon/mineIcon11.png';
import mineIcon12 from '../assets/icon/mineIcon12.png';
import mineIcon13 from '../assets/icon/mineIcon13.png';
import mineIcon14 from '../assets/icon/mineIcon14.png';
import mineIcon15 from '../assets/icon/mineIcon15.png';
import mineIcon16 from '../assets/icon/mineIcon16.png';
import mineIcon17 from '../assets/icon/mineIcon17.png';
import mineIcon18 from '../assets/icon/mineIcon18.png';
import mineIcon19 from '../assets/icon/mineIcon19.png';
import mineIcon20 from '../assets/icon/mineIcon20.png';
import star_gray from '../assets/icon/star_gray.png';
import person from '../assets/icon/person.jpg';
@connect(state => ({userData: state.user}))
export default class Mine extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            selectedTabBar: "mine",
          Img:'',
          RightImg:''
        };
    }
    async componentDidMount(){
      const data=await fetch.paihangFunc();
      console.log(data);
      this.setState({Img:data.resource.dayOne[0]?data.resource.dayOne[0].headerImg:''})
      this.setState(({RightImg:data.resource.monthOne[0]?data.resource.monthOne[0].headerImg:''}))
    }
    // 退出选项
    getOut(){
        const {dispatch}=this.props;
        loginOut();
        Toast.success('退出成功,3s后进入登录界面',3,()=>{
            dispatch(routerRedux.push('/login'))
        })
    }
    render() {
        const {history,dispatch,userData}=this.props;
        const userInfo=userData.user;
      console.log(userInfo);
      const yugu=userInfo.yugu_gold?userInfo.yugu_gold:0.00;
      console.log(userInfo.yugu_area_gold,'wc');
      const dlyugu=userInfo.yugu_area_gold!=='undefined'?userInfo.yugu_area_gold:0.00;
      console.log(dlyugu,'ccccc');
      // 传入tabBar参数
        const tabBarProps = {
            selectedTabBar: this.state.selectedTabBar,
            history
        };
        // doubleBtn参数
        const DoubleBtnProps={
            btnWidth:175,
            btnHeight:60,
            leftContent:'提现',
            leftBackground:'#FFD4E2',
            leftColor:'#FF5777',
            leftTap(){
                dispatch(routerRedux.push('/recharge?type=1'))
            },
            rightContent:'充值',
            rightBackground:'#FE4070',
            rightColor:'#FFFFFF',
            rightTap(){
                dispatch(routerRedux.push('/recharge?type=2'))
            },
        }
        return (
            <div className={styles.rootBox}>

                {/*底部标签栏*/}
                <MyTabBar {...tabBarProps}/>

                <div className={styles.main}>
                    {/* 头部 */}
                    <div className={styles.top}>
                        <div className={styles.topBg}></div>
                        <div className={styles.topContent}>
                            <div>
                                <span>{userInfo._id?Number(userInfo.gold).toFixed(2):0}</span>
                                <span>我的余额</span>
                            </div>
                            <div>
                                <span>{userInfo._id?Number(userInfo.kyJifen).toFixed(2):0}</span>
                                <span>可用积分</span>
                            </div>
                            <div>
                                <span>{userInfo._id?Number(userInfo.ysJifen).toFixed(2):0}</span>
                                <span>原始积分</span>
                            </div>
                          <div>
                            <span>{yugu}</span>
                            <span>用户预估收益</span>
                          </div>
                        </div>
                        {/* 头像信息 */}
                        <div className={styles.headBox}>
                            <div>
                                <div className={styles.leftIcon}>
                                    <img src={userInfo.headerImg===''||!userInfo.headerImg?person:APIHost+userInfo.headerImg} alt=""/>
                                </div>
                                <div className={styles.rightInfo}>
                                    <p className={styles.name}>{userInfo.name}<span>活跃度{userInfo.activity}</span></p>
                                    <p className={styles.rank}><span>会员</span>{userInfo.merchantId?<span>商家</span>:''}{userInfo.agentId?<span>代理</span>:''}</p>
                                    {/* 按钮组件 */}
                                    <DoubleBtn {...DoubleBtnProps} />
                                </div>
                            </div>
                        </div>
                    </div>




                    {/* 菜单盒子 */}
                    <div className={styles.menuBox}>
                        {/* 菜单分类 */}
                        <div className={styles.menuLine}>
                            <p className={styles.title}>个人相关</p>
                            {/* 菜单容器 */}
                            <div>
                                <div className={styles.menuItem} onClick={()=>history.push('/myinfoedit')} >
                                    <div><img src={mineIcon15} alt=""/></div>
                                    <span>个人信息</span>
                                </div>
                                {/*<div className={styles.menuItem} onClick={()=>history.push('/chgpwd')} >*/}
                                    {/*<div><img src={mineIcon20} alt=""/></div>*/}
                                    {/*<span>忘记密码</span>*/}
                                {/*</div>*/}

                                <div className={styles.menuItem} onClick={()=>history.push('/myorder')} >
                                    <div><img src={mineIcon01} alt=""/></div>
                                    <span>我的订单</span>
                                </div>
                                <div className={styles.menuItem} onClick={()=>history.push('/collectionlist')} >
                                    <div><img src={star_gray} alt=""/></div>
                                    <span>我的收藏</span>
                                </div>
                                <div className={styles.menuItem} onClick={()=>history.push('/myaddr')} >
                                    <div><img src={mineIcon02} alt=""/></div>
                                    <span>我的地址</span>
                                </div>
                                <div className={styles.menuItem} onClick={()=>history.push('/bankcard')}>
                                    <div><img src={mineIcon14} alt=""/></div>
                                    <span>我的银行卡</span>
                                </div>
                                <div className={styles.menuItem} onClick={()=>history.push('/yuelist')}>
                                    <div><img src={mineIcon19} alt=""/></div>
                                    <span>余额明细</span>
                                </div>
                                <div className={styles.menuItem} onClick={()=>history.push('/recharge?type=3')}>
                                    <div><img src={mineIcon04} alt=""/></div>
                                    <span>积分兑换</span>
                                </div>
                                <div className={styles.menuItem} onClick={()=>history.push('/originallist')}>
                                    <div><img src={mineIcon05} alt=""/></div>
                                    <span>原始积分</span>
                                </div>
                                <div className={styles.menuItem} onClick={()=>history.push('/availablelist')}>
                                    <div><img src={mineIcon06} alt=""/></div>
                                    <span>可用积分</span>
                                </div>
                                <div className={styles.menuItem} onClick={()=>history.push('/team')} >
                                    <div><img src={mineIcon07} alt=""/></div>
                                    <span>推广团队</span>
                                </div>
                                <div className={styles.menuItem} onClick={()=>history.push('/transferlist')} >
                                    <div><img src={mineIcon16} alt=""/></div>
                                    <span>付款记录</span>
                                </div>
                                {/* <div className={styles.menuItem}>
                                    <div><img src={mineIcon03} alt=""/></div>
                                    <span>我的客服</span>
                                </div> */}
                                <div className={styles.menuItem} onClick={()=>history.push('/qrcode')} >
                                    <div><img src={mineIcon13} alt=""/></div>
                                    <span>推广二维码</span>
                                </div>


                            </div>
                        </div>
                        {/* 菜单分类 */}
                        <div className={styles.menuLine}>
                            <p className={styles.title}>商家</p>
                            {/* 菜单容器 */}
                            {
                                userInfo.merchantId?
                                <div>
                                    <div className={styles.menuItem} onClick={()=>history.push('/merchantinfo')}>
                                        <div><img src={mineIcon09} alt=""/></div>
                                        <span>店铺信息</span>
                                    </div>
                                    <div className={styles.menuItem} onClick={()=>history.push('/merchantgoods')}>
                                        <div><img src={mineIcon18} alt=""/></div>
                                        <span>店铺商品</span>
                                    </div>
                                    <div className={styles.menuItem} onClick={()=>history.push('/merchant')}>
                                        <div><img src={mineIcon17} alt=""/></div>
                                        <span>店铺收益</span>
                                    </div>
                                    <div className={styles.menuItem} onClick={()=>history.push('/payqrcode')} >
                                        <div><img src={mineIcon10} alt=""/></div>
                                        <span>收款码</span>
                                    </div>
                                </div>
                                :
                                <div>
                                    <div className={styles.menuItem} onClick={()=>history.push('/applymer')}>
                                        <div><img src={mineIcon08} alt=""/></div>
                                        <span>申请入驻</span>
                                    </div>
                                </div>
                            }


                        </div>
                        {/* 菜单分类 */}
                        <div className={styles.menuLine}>
                            <p className={styles.title}>代理</p>
                            {/* 菜单容器 */}
                            <div>
                                {
                                    userInfo.agentId?
                                    <div className={styles.menuItem} onClick={()=>history.push('/agent')}>
                                        <div><img src={mineIcon11} alt=""/></div>
                                        <span>代理商</span>
                                    </div>
                                    :
                                    <div className={styles.menuItem} onClick={()=>history.push('/applyagent')}>
                                        <div><img src={mineIcon11} alt=""/></div>
                                        <span>申请代理商</span>
                                    </div>
                                }
                              <div style={{display:dlyugu?'flex':'none'}}  className={styles.menuItem} onClick={()=>history.push('/applyagent')}>
                                <div>{dlyugu}</div>
                                <span>代理预估收益</span>
                              </div>
                            </div>
                        </div>
                    </div>




                    {/* 这是分享佣金排行 */}
                    <div className={styles.ranking}>
                        <p className={styles.title}>分享赚佣金TOP榜</p>
                        {/* 排行容器 */}
                        <div>
                            {/* 左排行 */}
                            <div className={styles.leftRank}>
                                {/* 排行名称 */}
                                <p>今日佣金排行榜</p>
                                {/* 排行子项 */}
                                <div className={styles.rankItem}>
                                    <span>1.</span>
                                    <div><img src={this.state.RightImg===''?person:APIHost+this.state.Img} alt=""/></div>
                                </div>
                                {/* 排行子项 */}
                                {/*<div className={styles.rankItem}>*/}
                                    {/*<span>1.</span>*/}
                                    {/*<div><img src={person} alt=""/></div>*/}
                                {/*</div>*/}
                            </div>
                            {/* 右排行 */}
                            <div className={styles.rightRank}>
                                {/* 排行名称 */}
                                <p>今日全国排行榜</p>
                                {/* 排行子项 */}
                                <div className={styles.rankItem}>
                                    <span>1.</span>
                                    <div><img src={this.state.RightImg===''?person:APIHost+this.state.RightImg} alt=""/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 退出登录选项 */}
                    <div className={styles.outBtnBox}>
                        <Button type='primary' onClick={()=>this.getOut()} >退出登录</Button>
                    </div>

                </div>
            </div>
        )
    }
}
