import React, {Component} from 'react';
import style from './Header.less';
import history from 'history/createHashHistory';
import * as user from '../../services/user';
import  {Toast} from 'antd-mobile';
import {connect} from "dva";
@connect(state => ({userData: state.user}))
export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state={flag:false}
  }


  async handleClickSearch(){
    const {dispatch,userData}=this.props;
    let page=userData.pagination.page+1;
    this.props.handleData(true,this.refs.search.value);
    dispatch({
      type:'user/Taobao',
      payload:{
        page:1,
        size:20,
        keyword: this.refs.search.value,
      }
    });
    document.documentElement.scrollTop=0;
    if(userData.taobaoLists.length>1){
      Toast.info('正在搜索',1);
      this.setState({flag:true})
    }else if(this.state.flag){
      if(userData.taobaoLists.length<1){
        Toast.info('无',1);
        this.setState({flag:false})
      }
    }

    console.log(userData.taobaoLists,'当前状态eeeeeeeeeDJ');

    // const data=await user.taoBao({keyword:this.refs.search.value,page:1,size:35});
    // data.result_list?this.props.handleData(data.result_list,this.refs.search.value):Toast.offline('商品不存在',1.5);
    // console.log(data,'子级');
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
          <input  className={style.SearchInpt} type="text" ref='search'/>
        </div>
      </div>
    )
  }
}
