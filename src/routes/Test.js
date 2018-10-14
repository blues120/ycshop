import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {loggedIn, loginOut, APIHost} from '../utils/fetch';
import styles from "./styles/test.less";
import { Button,Toast,List,InputItem} from 'antd-mobile';
import MyTabBar from "../components/TabBar";
import MyNavBar from "../components/MyNavBar";
import * as fetch from '../services/shop';
import GoodItem from './../components/GooodItem';
import { Chart, Axis, Geom, Tooltip } from 'bizcharts';
const Item=List.Item;
@connect(state => ({shopData: state.shop}))
export default class Test extends Component {

    // 构造函数
    constructor(props) {
        super(props);
        this.state = {
            selectedTabBar: "shop"
        };
    }


    render() {
        const {history,dispatch}=this.props;
        // 传入navbBar参数
        const navBarProps = {
            leftVisible:true,
            leftFunc(){
                dispatch(routerRedux.push('/'))
            },
            titleName:"这是一个标题",
        }
        const  chartList=[{"value":0.25,"year":"06-25"},{"value":0.27,"year":"06-26"},{"value":0.3,"year":"06-27"},{"value":0.4,"year":"06-28"},{"value":0.35,"year":"06-29"},{"value":0.2,"year":"06-30"},{"value":0.21,"year":"07-1"}]
        // 传入tabBar参数
        const tabBarProps = {
            selectedTabBar: this.state.selectedTabBar,
            history
        }
        const cols = {
            'gkcprice': { min: 0 },
            'create_time': {range: [ 0 , 1] }
          };
          
          const label = {
            offset: 24,
            textStyle: {
              textAlign: 'center', // 文本对齐方向，可取值为： start center end
              fill: '#FFFFFF', // 文本的颜色
              fontSize: 24, // 文本大小
              fontWeight: 'bold', // 文本粗细
              rotate: 0, 
              textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
            }
          }
        return (
            <div>
                
                {/*头部导航栏*/}
                <MyNavBar {...navBarProps}/>
                {/*底部标签栏*/}
                <MyTabBar {...tabBarProps}/>

                <div className={styles.main}>
                <div className={styles.chart}>
                <Chart   data={chartList} scale={cols} forceFit>
                  <Axis  label={label} name="year" />
                  <Axis  label={label} name="value" />
                  <Geom color="#000" type="line" position="year*value" size={4} />
                  <Geom color="#ffbe00" type='point'  position="year*value" size={8} shape={'circle'} style={{ stroke: '#000', lineWidth: 1}} />
                </Chart>
              </div>
                        <List>
                            <InputItem>测试</InputItem>
                            <InputItem>第二 </InputItem>
                        </List>
                        <List>
                            <Item extra="test">测试</Item>
                            <Item>测试</Item>
                        </List>
                </div>
            </div>
        )
    }
}
