import * as fetchs from '../utils/fetch';



// 注册
export function register(params){
  return fetchs.create(fetchs.APIHost+"/user/register",params).then(response => response.json())
  .then(json => { return json});
}

// 登录
export function login(params){
  return fetchs.read_Token(fetchs.APIHost+"/user/login",fetchs.getAuth("/user/login",params.username,params.password)).then(response => response.json())
  .then(json => { return json});
}



// 获取验证码
export async function  getRegCode(params) {
  return fetchs.create(fetchs.APIHost+"/sms/reg",params).then(response => response.json())
    .then(json => {return json});
}
// 更改密码
export async function  chgPwd(params) {
  return fetchs.create(fetchs.APIHost+"/user/backPwd",params).then(response => response.json())
    .then(json => {return json});
}


// 更改密码获取验证码
export async function getResetCode(params) {
  return fetchs.create(fetchs.APIHost+"/sms/reset",params).then(response => response.json())
    .then(json => {return json});
}

export async function  xieyi() {
  return fetchs.read(fetchs.APIHost+"/systemSet/agreement/list").then(response => response.json())
    .then(json => {return json});
}



