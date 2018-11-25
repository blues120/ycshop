require('fetch-ie8');
var AES = require("crypto-js/aes");
var HmacMD5 = require("crypto-js/hmac-md5");
var store = require('store');
var CryptoJS = require("crypto-js");
export const APIHost ='http://122.112.244.103:9011';  //服务器
// export const APIHost ='http://10.10.10.103:1235';
// export const APIHost ='http://10.10.10.145:5000';
// export const APIHost='http://192.168.2.250:5000';
// export const APIHost='http://47.92.88.214:9011';  // 214
// export const APIHost ='http://192.168.1.100:5000';  //  本地

var defaultParams = {
  mode: 'cors',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
  }
};
/**
 * HTTP GET
 * @param  {string} url
 * @return {Promise}
 */
export function read(url) {
  return fetch(url, {
    ...defaultParams,
    method: 'get'
  });
}

/**
 * HTTP POST
 * @param  {string} url
 * @param  {object} body
 * @return {Promise}
 */
export function create(url, body = {}) {

  return fetch(url, {
    ...defaultParams,
    method: 'post',
    body: JSON.stringify(body)
  });
}

/**
 * HTTP PUT
 * @param  {string} url
 * @param  {object} body
 * @return {Promise}
 */
export function update(url, body = {}) {

  return fetch(url, {
    ...defaultParams,
    method: 'put',
    body: JSON.stringify(body)
  });
}


/**
 * HTTP DELETE
 * @param  {string} url
 * @return {Promise}
 */
export function destroy(url) {
  return fetch(url, {
    ...defaultParams,
    method: 'delete'
  });
}

/************************************* token **********************************/
/**
 * HTTP GET
 * @param  {string} url
 * @param  {string} token
 * @return {Promise}
 */
export function read_Token(url,token) {
  defaultParams.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization':token
  };
  return fetch(url, {
    ...defaultParams,
    method: 'get'
  });
}

export function creat_Token(url,token,body={}) {
  // defaultParams.headers.Authorization = token;
  defaultParams.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization':token
  };
  return fetch(url, {
    ...defaultParams,
    method: 'post',
    body: body
  });
}

export function delete_Token(url,token) {
  defaultParams.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization':token
  };
  return fetch(url, {
    ...defaultParams,
    method: 'delete'
  });
}

export function update_Token(url,token,body={}) {
  defaultParams.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization':token
  };
  return fetch(url, {
    ...defaultParams,
    method: 'put',
    body: body
  });
}


export function uploadImg_Token(url,body) {
  return fetch(url, {
    method: 'post',
    body: body,
  });
}


// export function getAuth(url,username,password){
//   var CryptoJs = require("crypto-js");
//   if(!password&&!store.get("user")){return null}

//   var iv = CryptoJs.enc.Latin1.parse('O2%=!ExPCuY6SKX(');
//   var key = CryptoJs.enc.Latin1.parse(password? HmacMD5(password,password).toString() : store.get("user").password);
//   var pass = AES.encrypt(url+":"+new Date().getTime(),key,{iv:iv,mode:CryptoJs.mode.CBC,padding:CryptoJs.pad.ZeroPadding}).toString();
//   return (username? username : store.get("user").username)+":"+pass;
// }

export function getAuth(url,username,password){
      if(!password&&!store.get("user")){return null}
      password = password ? password : CryptoJS.AES.decrypt(store.get("user").password,"TongYi@2017:").toString(CryptoJS.enc.Utf8);
      var hmacPassword = CryptoJS.HmacMD5(password,password).toString();
      var hexPassword = hmacPassword.slice(0,16);
      var word = url+":"+new Date().getTime();
      var parsedWord = CryptoJS.enc.Utf8.parse(word);
      var parsedKey = CryptoJS.enc.Utf8.parse(hexPassword);
      var encrypted = CryptoJS.AES.encrypt(parsedWord,parsedKey,{mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
      encrypted = encrypted.toString();
      return "bearer "+(username? username : store.get("user").username)+":"+encrypted;
}


//登陆
export function login(username,password){
  store.set("user",{username:username,password:password});
  console.log("登录成功")
}
//登出
export function loginOut(){
  store.remove("user");
  store.remove('pw');
  console.log("登出成功")
}
//存ID
export function setId(id){
  store.set("id",{id:id});
}

export function loggedIn() {
  var user = store.get("user");
  if(!!user){
    return user
  }else{
    return false;
  }
}





