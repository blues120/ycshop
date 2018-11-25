import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';
function RouterConfig({ history,app }) {
  // 首页
  const IndexPage = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/IndexPage'),
  });



  // 登录
  const Login = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/Login'),
  });

   // 注册
   const Reg = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/Reg'),
  });
  // 注册
  const ChgPwd = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/ChgPwd'),
  });

  // 商品列表
  const GoodList = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/GoodList'),
  });
  // 商品详情
  const GoodDetail = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/GoodDetail'),
  });

  const MiaoDetail = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/MiaoDetail'),
  });
  // 团购详情
  const GrouponDetail = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/GrouponDetail'),
  });

   // 购物车
  const Cart = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/Cart'),
  });
   // 下单
   const ConfirmOrder = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/ConfirmOrder'),
  });


  // 限时秒杀
  const FlashSaleList = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/FlashSaleList'),
  });
  // 团购列表
  const GrouponList = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/GrouponList'),
  });
  // 发现
  const Findings = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/Findings'),
  });

  // 个人中心
  const Mine = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/Mine'),
  });

  // 我的订单
  const MyOrder = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/MyOrder'),
  });
  // 我的订单详情
  const MyOrderDetail = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/MyOrderDetail'),
  });

  // 二维码
  const QrCode = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/QrCode'),
  });
  // 我的团队
  const Team = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/Team'),
  });
  // 我的充值和提现和转换
  const Recharge = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/Recharge'),
  });
  // 提现列表
  const RecallList = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/RecallList'),
  });
  // 充值列表
  const RechargeList = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/RechargeList'),
  });
  // 积分转换列表
  const ExchangeList = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/ExchangeList'),
  });
  // 我的地址
  const MyAddr = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/MyAddr'),
  });

  // 地址编辑
  const MyAddrEdit = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/MyAddrEdit'),
  });


  // BankCard
  const BankCard = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/BankCard'),
  });
  // BankCardEdit
  const BankCardEdit = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/BankCardEdit'),
  });

  // 收益记录
  const OriginalList = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/OriginalList'),
  });

  // 积分记录
  const AvailableList = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/AvailableList'),
  });

  // 商家入驻申请
  const ApplyMer = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/ApplyMer'),
  });
  // 代理申请
  const ApplyAgent = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/ApplyAgent'),
  });

  // 我的代理
  const Agent = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/Agent'),
  });

  // 商家收益
  const Merchant = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/Merchant'),
  });
  // 商家信息
  const MerchantInfo = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/MerchantInfo'),
  });
  // 商家商品列表
  const MerchantGoods = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/MerchantGoods'),
  });




  // 商家收款二维码
  const PayQrCode = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/PayQrCode'),
  });

  // 修改个人信息
  const MyInfoEdit = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/MyInfoEdit'),
  });


  // 支付订单
  const PayOrder = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/PayOrder'),
  });


  //转账
  const Transfer = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/Transfer'),
  });
  //转账记录
  const TransferList = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/TransferList'),
  });

  //评价
  const ReviewList = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/ReviewList'),
  });
  //评价
  const Review = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/Review'),
  });


  //我的收藏列表
  const CollectionList = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/CollectionList'),
  });

  //商家店铺界面
  const Shop = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/Shop'),
  });


  // 商品分类
  const Classify = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/Classify'),
  });


  // 商品分类
  const YuEList = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/YuEList'),
  });
  const RechargeT = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/RechargeT'),
  });

  const Message = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/Message'),
  });
  const MessageDetail = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/MessageDetail'),
  });
  // const Record = dynamic({
  //   app,
  //   models: () => [
  //     import('./models/shop'),
  //   ],
  //   component: () => import('./routes/Record/Record'),
  // });
  const NeverUp = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/Record/NeverUp'),
  });
  const Notice = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/Notice/Notice'),
  });
  const NoticeDetail = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/NoticeDetail/NoticeDetail'),
  });
  const TuiSY = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/TuiSY/TuiSY'),
  });
  const TaoBao = dynamic({
    app,
    models: () => [
      import('./models/user'),
    ],
    component: () => import('./routes/TaoBao/TaoBao'),
  });
  const JifenDetail = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/JifenDetail'),
  });
  const Cop = dynamic({
    app,
    models: () => [
      import('./models/shop'),
    ],
    component: () => import('./routes/Cop'),
  });
  // MyInfoEdit
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/login" exact component={Login} />
        <Route path="/reg" exact component={Reg} />
        <Route path="/chgpwd" exact component={ChgPwd} />

        <Route path="/goodlist" exact component={GoodList} />
        <Route path="/gooddetail" exact component={GoodDetail} />
        <Route path="/grouponDetail" exact component={GrouponDetail} />
        <Route path="/cart" exact component={Cart} />
        <Route path="/confirmorder" exact component={ConfirmOrder} />
        <Route path="/flashsalelist" exact component={FlashSaleList} />
        <Route path="/grouponlist" exact component={GrouponList} />
        <Route path="/findings" exact component={Findings} />
        <Route path="/mine" exact component={Mine} />
        <Route path="/myorder" exact component={MyOrder} />
        <Route path="/myorderdetail" exact component={MyOrderDetail} />

        <Route path="/qrcode" exact component={QrCode} />
        <Route path="/team" exact component={Team} />
        <Route path="/recharge" exact component={Recharge} />
        <Route path="/myAddr" exact component={MyAddr} />
        <Route path="/myaddredit" exact component={MyAddrEdit} />
        <Route path="/recalllist" exact component={RecallList} />
        <Route path="/rechargelist" exact component={RechargeList} />
        <Route path="/exchangelist" exact component={ExchangeList} />

        <Route path="/bankcard" exact component={BankCard} />
        <Route path="/bankcardedit" exact component={BankCardEdit} />
        <Route path="/originallist" exact component={OriginalList} />
        <Route path="/availablelist" exact component={AvailableList} />
        <Route path="/applymer" exact component={ApplyMer} />
        <Route path="/applyagent" exact component={ApplyAgent} />
        <Route path="/agent" exact component={Agent} />
        <Route path="/merchant" exact component={Merchant} />
        <Route path="/merchantinfo" exact component={MerchantInfo} />
        <Route path="/merchantgoods" exact component={MerchantGoods} />



        <Route path="/payqrcode" exact component={PayQrCode} />
        <Route path="/myinfoedit" exact component={MyInfoEdit} />

        <Route path="/payorder" exact component={PayOrder} />

        <Route path="/transfer" exact component={Transfer} />
        <Route path="/transferlist" exact component={TransferList} />

        <Route path="/reviewlist" exact component={ReviewList} />
        <Route path="/review" exact component={Review} />

        <Route path="/collectionlist" exact component={CollectionList} />

        <Route path="/shop" exact component={Shop} />


        <Route path="/classify" exact component={Classify} />
        <Route path="/yuelist" exact component={YuEList} />
        <Route path="/recharget" exact component={RechargeT} />
        <Route path="/message" exact component={Message} />
        <Route path="/messagedetail" exact component={MessageDetail} />
        <Route path="/miaodetail" exact component={MiaoDetail} />
        <Route path="/neverup" exact component={NeverUp} />
        <Route path="/notice" exact component={Notice} />
        <Route path="/noticedetail" exact component={NoticeDetail} />
        <Route path="/tuisy" exact component={TuiSY} />
        <Route path="/taobao" exact component={TaoBao} />
        <Route path="/jifendetail" exact component={JifenDetail} />
        <Route path="/cop" exact component={Cop} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
