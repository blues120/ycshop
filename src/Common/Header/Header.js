import React, {Component} from 'react';
import style from './Header.less';
import history from 'history/createHashHistory';
import * as user from '../../services/user';
export default class Header extends Component {

  async handleClickSearch(){
    const data=await user.TBS({keyword:this.refs.search.value,page:1,size:20});
    console.log(data,'子级');
    this.props.handleData(data);
  }

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
        <span  className={style.bc}>{this.props.RightTitle?this.props.RightTitle:''}</span>
        {/*确定*/}
        <span  className={style.bc}  onClick={this.handleClickSearch.bind(this)}>{this.props.qd?this.props.qd:''}</span>
        {/*右标题*/}
        <span onClick={()=>history().push('/login')} className={style.bc}>{this.props.rightTitle?this.props.rightTitle:''}</span>
        {/*编辑*/}
        <span className={style.bc}>{this.props.shopTitle?this.props.shopTitle:''}</span>

        <div className={style.searchDiv} style={{display:(this.props.Search?'flex':'none')}}>
          <div className={style.opcDic}></div>
          <img src={require('../../assets/images/mallSearch.png')} alt=""/>
          <input  type="text" ref='search'/>
        </div>
      </div>
    )
  }
}
