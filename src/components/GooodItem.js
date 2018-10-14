/*
 * @Author: 杜梦
 * @Date: 2018-07-03 10:50:15
 * @Last Modified by: 杜梦
 * @Last Modified time: 2018-08-20 17:15:41
 */
import React from 'react';
import PropTypes from 'prop-types';
import styles from "./styles/goodItem.less";
import {APIHost} from '../utils/fetch';
const GoodItem = ({
    goodData = [],
    tapItem=()=>{return;}
}) => {
    return (
        <div className={styles.goodList}>
            {goodData.map((i, index) => {
                return (
                    <div key={index} className={styles.itemBox}>
                        <div className={styles.itemBody} onClick={()=>tapItem(i)}>
                            <div className={styles.imgbox}>
                                <img src={APIHost+i.cover} alt=""/>
                            </div>
                            <div className={styles.infoBox}>
                                <p className={styles.name}>{i.name}</p>
                                <p className={styles.detail}>{i.introduction}</p>
                                <p className={styles.info}><span>原价{i.model[0].propertyOriginalPrice}</span><span>销量{i.sales}</span></p>
                                <p className={styles.price}>¥{i.model[0].propertyPrice}<span>赠送{i.returnYSjifen*100}%</span></p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
GoodItem.propTypes = {

}
export default GoodItem
