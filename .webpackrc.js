/*
 * @Author: 杜梦 
 * @Date: 2018-07-02 09:55:39 
 * @Last Modified by: 杜梦
 * @Last Modified time: 2018-07-13 10:26:34
 */

//  ["import", {"libraryName": "antd-mobile", "style": true  此项为默认加载less,所以}]
import pxtorem from 'postcss-pxtorem';

export default {
  "entry": "src/index.js",
  "theme": "./src/theme.js",
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        ["import", {"libraryName": "antd-mobile", "style": true}]
      ],
      extraPostCSSPlugins: [
        pxtorem({
          rootValue: 100,
          propWhiteList: [],
        }),
      ],
    },
    "production": {
      "extraBabelPlugins": [
        ["import", {"libraryName": "antd-mobile", "style": true}]
      ],
      extraPostCSSPlugins: [
        pxtorem({
          rootValue: 100,
          propWhiteList: [],
        }),
      ],
    }
  }
}