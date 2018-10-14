/*
 * @Author: 杜梦 
 * @Date: 2018-07-02 16:53:02 
 * @Last Modified by: 杜梦
 * @Last Modified time: 2018-08-17 11:53:32
 */
import React ,{Component} from 'react';
import {Button} from "antd-mobile";
import PropTypes from 'prop-types';

const DoubleBtn = (
  {
    btnWidth=200,
    btnHeight=80,
    leftContent='左',
    leftBackground='#FFD3E2',
    leftColor='#FE4274',
    leftTap=()=>{return},
    rightContent='右',
    rightBackground='#FE4274',
    rightColor='#FFFFFF',
    rightTap=()=>{return},
  }
) => {
  
  return (
    <div style={{display:'flex',width:'${btnWidth*2}px'}}>
      <style>
      {`
        .am-button-active{
          background:#BBBBBB !important;
          color:rgba(255,255,255,0.3) !important;
        }
        .doubleBtn .am-button-primary::before{
          border:none !important;
        }
      `}
      </style>
      {/* 左按钮 */}
      <div className='doubleBtn' style={{width:`${btnWidth}px`}}>
        <Button 
          className='leftBtn' 
          type='primary'
          style={{borderRadius:`${btnHeight/2}px 0 0 ${btnHeight/2}px`,backgroundColor:leftBackground,color:leftColor,height:`${btnHeight}px`,lineHeight:`${btnHeight}px`}}
          onClick={()=>leftTap()}
        >
          {leftContent}
        </Button>
      </div>

      {/* 右按钮 */}
      <div className='doubleBtn' style={{width:`${btnWidth}px`}}>
        <Button 
          className='rightBtn' 
          type='primary'
          style={{borderRadius:`0 ${btnHeight/2}px ${btnHeight/2}px 0`,backgroundColor:rightBackground,color:rightColor,height:`${btnHeight}px`,lineHeight:`${btnHeight}px`}}
          onClick={()=>rightTap()}
        >
          {rightContent}
        </Button>
      </div>
    </div>
  );
};


// 规定参数的数据格式.
DoubleBtn.propTypes = {
  
}
export default DoubleBtn;

