import React, {Component} from 'react';
import style from './Header.less';
import history from 'history/createBrowserHistory';
export default class Header extends Component {
  render() {
    return (
      /*改变背景颜色*/
      <div className={style.Header}>
        {/*标题*/}
        <span>{this.props.title?this.props.title:''}</span>
        {/*回退*/}
        <span className={style.img_s}  style={{display:(this.props.image?'block':'none')}}>
        <img onClick={()=>history().goBack()} src={this.props.image?this.props.image:''} alt=""/></span>
        {/*保存*/}
        <span className={style.bc}>{this.props.rightTitle?this.props.rightTitle:''}</span>
        {/*编辑*/}
        <span className={style.bc}>{this.props.shopTitle?this.props.shopTitle:''}</span>
        {/*搜索*/}
      </div>
    )
  }
}
