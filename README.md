# vue2-weather

> 基于Vue 2.x + Vue Router + Vant的移动端实时天气网站。数据来源于气象大数据平台提供的免费试用产品集：[中国气象数据_天气数据接口-气象大数据平台](http://www.weatherdt.com/datadetail.html?code=9e3a049c-4b4b-4820-84bd-5ea8ae02e54d)。



## 安装依赖、运行项目

```
# 克隆项目
git clone git@github.com:sugarboo/vue2-weather.git

# 进入项目目录
cd vue2-weather

# 安装依赖(推荐使用yarn)
yarn
或
npm install

# 启动服务(推荐使用yarn)
yarn serve
或
npm run serve
```



## 数据来源

数据来源于气象大数据平台提供的免费试用产品集：[中国气象数据_天气数据接口-气象大数据平台](http://www.weatherdt.com/datadetail.html?code=9e3a049c-4b4b-4820-84bd-5ea8ae02e54d)。

获取方法及步骤：[免费试用产品集-气象大数据平台](http://www.weatherdt.com/blog/detail/132.html)。



## 技术栈

### Vue 2.x

[Vue.js](https://cn.vuejs.org)

### Vue Router

[Vue Router](https://router.vuejs.org/zh/)

### Vant (移动端UI框架)

[Vant - 轻量、可靠的移动端组件库](https://vant-contrib.gitee.io/vant/#/zh-CN/)



## 项目目录结构

```
├── public                     	# 静态资源
│   │── favicon.ico            	# favicon图标
│   └── index.html             	# html模板
├── src                        	# 源代码
│   ├── assets                 	# 图片等静态资源
│   ├── components             	# 全局公用组件
│   ├──   ├── MyHeader.vue      # 顶部导航栏组件
│   ├── router                 	# 路由
│   ├──   ├── index.js          # 路由配置文件
│   ├── views                  	# views 所有页面
│   ├──   ├── CityList.vue      # 城市列表页
│   ├──   ├── Home.vue          # 主页
│   ├── App.vue                	# 入口页面
│   ├── main.js                	# 入口文件
├── .browserslistrc            	# 浏览器兼容 配置项
├── .gitignore                  # git忽略文件配置
├── .eslintrc.js               	# eslint 配置项
├── README.md                   # 项目文档
├── babel.config.js            	# babel-loader 配置
├── package.json               	# package.json
├── postcss.config.js          	# postcss 配置
└── vue.config.js              	# vue-cli 配置
```



## 功能设计

### 首页

用户进入网站首页后，默认显示的是北京地区的天气情况，页面上方部分展示的是实时气温、天气状态、天气状态图标；页面中部展示的是今明两天的最低气温、最高气温以及天气状态预报；页面下方部分展示的是实时天气详情，包括湿度、降水量、能见度、风向、风力以及气压的具体数据。

### 城市列表页

用户点击网站首页左上方的“城市列表”按钮，即可进入城市列表页面。由于本网站的天气数据来源是由气象大数据平台的免费试用产品集提供，数据不够全面，因此城市列表页面中只提供了北京、上海、广州、深圳和重庆这五个城市。用户点击相应的按钮即可查询对应城市的天气情况。



## 实现思路



### /src/main.js：引入Vant；挂载全局对象axios

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// 引入axios
import axios from 'axios'
Vue.prototype.$axios = axios // 挂载全局对象axios

// 引入Vant
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```



### /vue.config.js：跨域处理；配置'@'别名

```js
'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = 'Vue-weather' // page title

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false, // close eslint
  productionSourceMap: false,
  devServer: {
    // 跨域配置
    proxy: 'http://api.weatherdt.com/',
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      // '@' 别名配置
      alias: {
        '@': resolve('src')
      }
    }
  }
}
```



### /postcss.config.js：postcss插件配置(px自动转rem)

```js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 15,
      propList: ['*']
    }
  }
}
```



### /src/router/index.js：Vue-Router路由配置

```js
const routes = [
  /* 首页 */
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home')
  },
  /* 城市列表 */
  {
    path: '/cityList',
    name: 'CityList',
    component: () => import('@/views/CityList')
  }
]
```





### /src/App.vue：挂载router-view；设置全局样式

```vue
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less" scoped>
#app {
  height: 100vh;
  background-color: #f2f2f2;
}
</style>
```



### /src/components/MyHeader.vue：顶部导航栏组件

```vue
<template>
  <van-nav-bar
    :title="title"
    @click-left="onClickCityList"
    @click-right="onClickHome"
  >
    <template #left>
      <van-icon name="wap-nav" size="1.6rem" />
    </template>
    <template #right>
      <van-icon name="location" size="1.6rem" />
    </template>
  </van-nav-bar>
</template>

<script>
export default {
  name: 'MyHeader',
  props: {
    // 接收父组件传过来的title
    title: {
      default: '',
      type: String
    }
  },
  methods: {
    /* 右上角的主页按钮点击事件处理 */
    onClickHome() {
      // 判断当前页面是否为主页. 若是, 则不进行跳转操作; 否则跳转到主页
      const { name } = this.$route
      name !== 'Home' && this.$router.push({ name: 'Home' })
    },
    /* 左上角的城市列表按钮的点击事件处理 */
    onClickCityList() {
      // 判断当前页面是否为城市列表页面. 若是, 则不进行跳转操作; 否则跳转到城市列表页面
      const { name } = this.$route
      name !== 'CityList' && this.$router.push({ name: 'CityList' })
    }
  }
}
</script>
```



### /src/views/CityList.vue：城市列表页

```vue
<template>
  <div>
    <my-header title="城市列表" />
    <div class="main">
      <van-cell-group inset>
        <van-cell v-for="item in cityList" :key="item.area" @click="onClickCity(item.area, item.title)">
          <span>{{ item.title }}</span>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/MyHeader'
export default {
  name: 'CityList',
  components: { MyHeader },
  data() {
    return {
      // 城市列表
      cityList: [
        { title: '北京', area: '101010100' },
        { title: '上海', area: '101020100' },
        { title: '广州', area: '101280101' },
        { title: '深圳', area: '101280601' },
        { title: '重庆', area: '101040100' }
      ],
    }
  },
  methods: {
    /* 城市选项的点击事件处理 */
    onClickCity(area, title) {
      // 将当前点击的城市选项的城市站号(area), 城市名称(title)保存到路由参数中, 传给主页
      this.$router.push({
        name: 'Home',
        query: { area }, // 使用路由参数query保存城市站号(area), 会显示在url中
        params: { title } // 使用路由参数params保存城市名称(title), 不会显示在url中
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin-top: 16px;
}
</style>
```



### /src/views/Home.vue：主页

```js
/* 略，详见源码 */
```



