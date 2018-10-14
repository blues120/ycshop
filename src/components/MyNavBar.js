/*
 * @Author: 杜梦 
 * @Date: 2018-07-02 16:53:02 
 * @Last Modified by: 杜梦
 * @Last Modified time: 2018-07-03 10:57:33
 */
import React ,{Component} from 'react';
import { NavBar,Icon} from "antd-mobile";
import PropTypes from 'prop-types';


// leftVisible(左侧是否显示,可不传默认显示,Boolean)
// leftFunc(左侧点击方法,非必填,func) 
// titleName(主标题,可不穿默认为标题,string) 
// rightContent(右侧显示内容,非必填默认为空,string)
// rightFunc(右侧点击方法,非必填,func) 
// background(背景色,基本不用传,string)
// titleColor(标题颜色,基本不用传,string)
// sideColor(两侧的颜色,基本不用传,string)


const MyNavBar = ({leftVisible=true,leftFunc=()=>{return},titleName="标题",rightContent="",rightFunc=()=>{return},background="",titleColor="",sideColor=""}) => {
  
  return (
    <div>
      <style>
      {`
        .am-navbar-light .am-navbar-title {
          color: inherit;
        }
        .am-navbar-right {
          font-size: 0.30rem;
        }
        .rightContent{
          width: 100%;
          height: 100%;
          text-align: right;
          line-height: 100%;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: end;
          -ms-flex-pack: end;
          justify-content: flex-end;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
        }
      `}
      </style>
      <NavBar
      style={{background:background,color:titleColor,borderBottom:'1px solid rgba(161,161,161,0.3)'}}
      mode='dark'
      icon={
        <Icon type="left" style={{color:sideColor,visibility:leftVisible?"visible":"hidden"}} />
      }
      rightContent={<span className="rightContent" onClick={()=>rightFunc()}>{rightContent}</span>}
      onLeftClick={()=>leftFunc()}
      >{titleName}</NavBar>
    </div>
  );
};


// 规定参数的数据格式.
MyNavBar.propTypes = {
  leftVisible: PropTypes.bool,
  leftFunc: PropTypes.func,
  titleName: PropTypes.string,
  rightContent: PropTypes.string,
  rightFunc: PropTypes.func,
  background: PropTypes.string,
  titleColor: PropTypes.string,
  sideColor: PropTypes.string,
}
export default MyNavBar;

