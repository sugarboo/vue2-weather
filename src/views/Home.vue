<template>
  <div>
    <!-- 顶部导航栏 -->
    <my-header :title="title" />
    <!-- loading -->
    <van-empty v-if="loading" image="network" description="加载中" />
    <div class="main-container" v-else>
      <!-- 当前天气 -->
      <div class="current card">
        <div class="left-area">
            <div class="temperature">{{data.currentTemperature }}°C</div>
            <div class="weather-status">{{ weatherFormatter(data.currentWeatherStatusCode).status }}</div>
          </div>
          <div class="right-area">
            <van-image
              width="120"
              height="120"
              :src="weatherFormatter(data.currentWeatherStatusCode).imgUrl"
            />
          </div>
      </div>

      <!-- 今明两日天气预报 -->
      <div class="forecast">
        <div class="today-area card">
          <div class="header">
            <span class="status">{{ weatherFormatter(data.todayWeatherStatusCode).status }}</span>
            <van-tag color="#dddddd">今</van-tag>
          </div>
          <div class="temperature">
            <span class="lowest">
              {{ data.todayLowestTemperature }}°C
            </span>
            <span> - </span>
            <span class="highest">
              {{ data.todayHighestTemperature }}°C
            </span>
          </div>
        </div>
        <div class="tomorrow-area card">
          <div class="header">
            <span class="status">{{ weatherFormatter(data.tomorrowWeatherStatusCode).status }}</span>
            <van-tag color="#dddddd">明</van-tag>
          </div>
          <div class="temperature">
            <span class="lowest">
              {{ data.tomorrowLowestTemperature }}°C
            </span>
            <span> - </span>
            <span class="highest">
              {{ data.tomorrowHighestTemperature }}°C
            </span>
          </div>
        </div>
      </div>

      <!-- 当前天气详情 -->
      <div class="detail card">
        <van-row>
          <van-col span="8" class="detail-item">
            <div class="value">
              <span>{{ data.humidity }}</span>
              <span class="unit">%</span>
            </div>
            <van-tag round type="primary" size="large">湿度</van-tag>
          </van-col>
          <van-col span="8" class="detail-item">
            <div class="value">
              <span>{{ data.rain }}</span>
              <span class="unit">毫米</span>
            </div>
            <van-tag round type="primary" size="large">降水量</van-tag>
          </van-col>
          <van-col span="8" class="detail-item">
            <div class="value">
              <span>{{ data.visibility }}</span>
              <span class="unit">米</span>
            </div>
            <van-tag round type="primary" size="large">能见度</van-tag>
          </van-col>
          <van-col span="8" class="detail-item">
            <div class="value">{{ windDirectionFormatter[data.WindDirectionCode].title }}</div>
            <van-tag round type="primary" size="large">风向</van-tag>
          </van-col>
          <van-col span="8" class="detail-item">
            <div class="value">
              <span>{{ windScaleFormatter[data.WindScaleCode].title }}</span>
              <span class="unit">级</span>
            </div>
            <van-tag round type="primary" size="large">风力</van-tag>
          </van-col>
          <van-col span="8" class="detail-item">
            <div class="value">
              <span>{{ data.airPressure }}</span>
              <span class="unit">百帕</span>
            </div>
            <van-tag round type="primary" size="large">气压</van-tag>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/MyHeader'

export default {
  name: 'Home',
  components: { MyHeader },
  data() {
    return {
      loading: true, // 是否加载中
      data: {}, // 天气数据
      title: '', // 导航栏的标题
      area: '', // 城市站号

      // 风向格式化
      windDirectionFormatter: {
        '0': { value: '0', title: '无风向' },
        '1': { value: '1', title: '东北风' },
        '2': { value: '2', title: '东风' },
        '3': { value: '3', title: '东南风' },
        '4': { value: '4', title: '南风' },
        '5': { value: '5', title: '西南风' },
        '6': { value: '6', title: '西风' },
        '7': { value: '7', title: '西北风' },
        '8': { value: '8', title: '北风' },
        '9': { value: '9', title: '旋转风' }
      },
      // 风力格式化
      windScaleFormatter: {
        '0': { value: '0', title: '0-3' },
        '1': { value: '1', title: '3-4' },
        '2': { value: '2', title: '4-5' },
        '3': { value: '3', title: '5-6' },
        '4': { value: '4', title: '6-7' },
        '5': { value: '5', title: '7-8' },
        '6': { value: '6', title: '8-9' },
        '7': { value: '7', title: '9-10' },
        '8': { value: '8', title: '10-11' },
        '9': { value: '9', title: '11-12' }
      }
    }
  },

  created() {
    // 从路由参数中获取城市站号及城市名称
    const { query, params } = this.$route
    this.area = query.area || '101010100' // 默认值为北京的城市站号
    this.title = params.title || '北京' // 默认值为"北京"
    // 获取天气数据
    this.getData()
  },

  methods: {
    /* 发送请求, 获取天气数据 */
    getData() {
      this.loading = true // 开启加载中状态
      // 构造请求参数
      const params = {
        area: this.area, // 城市站号
        type: 'observe|history|forecast', // 数据类型标识
        key: 'a288a10ac6fe952e534462dc153bf03e', // 天气api接口的key
      }
      this.$axios({
        url: '/common/',
        method: 'GET',
        params
      }).then(res => {
        // 请求响应成功, 处理请求参数
        const { data } = res
        const { area } = this
        const currentTemperature = data.observe[area]['1001002']['002'] // 当前温度
        const currentWeatherStatusCode = data.observe[area]['1001002']['001'] // 当前天气状态的编号
        const todayWeatherStatusCode = data.observe[area]['1001002']['001'] // 今日天气状态的编号
        const todayLowestTemperature = data.history[area]['1001010']['002'] // 今日最低温度
        const todayHighestTemperature = data.history[area]['1001010']['001'] // 今日最高温度
        const tomorrowWeatherStatusCode = data.forecast['24h'][area]['1001001'][0]['001'] // 明日天气状态的编号
        const tomorrowLowestTemperature = data.forecast['24h'][area]['1001001'][0]['004'] // 明日最低温度
        const tomorrowHighestTemperature = data.forecast['24h'][area]['1001001'][0]['003'] // 明日最高温度
        const humidity = data.observe[area]['1001002']['005'] // 湿度
        const rain = data.observe[area]['1001002']['006'] // 降雨量
        const visibility = data.observe[area]['1001002']['008'] // 能见度
        const WindDirectionCode = data.observe[area]['1001002']['004'] // 风向的编号
        const WindScaleCode = data.observe[area]['1001002']['003'] // 风力的编号
        const airPressure = data.observe[area]['1001002']['007'] // 气压

        // 将处理后的请求参数保存在data中
        this.data = {
          currentTemperature, // 当前温度
          currentWeatherStatusCode, // 当前天气状态的编号
          todayWeatherStatusCode, // 今日天气状态的编号
          todayLowestTemperature, // 今日最低温度
          todayHighestTemperature, // 今日最高温度
          tomorrowWeatherStatusCode, // 明日天气状态的编号
          tomorrowLowestTemperature, // 明日最低温度
          tomorrowHighestTemperature, // 明日最高温度
          humidity, // 湿度
          rain, // 降雨量
          visibility, // 能见度
          WindDirectionCode, // 风向的编号
          WindScaleCode, // 风力的编号
          airPressure // 气压
        }
        this.loading = false // 关闭加载中状态
      }).catch(err => {
        console.log(err)
        this.loading = false // 关闭加载中状态
      })
    },

    // 天气状态 & 天气图标格式化
    weatherFormatter: code => {
      let codeNum = Number(code)
      let status = '' // 天气状态
      let imgUrl = '' // 天气图标
      if (codeNum === 0) {
        status = '晴天'
        imgUrl = require('@/assets/sunny.png')
      } else if (codeNum === 1) {
        status = '多云'
        imgUrl = require('@/assets/cloudy.png')
      } else if (codeNum === 2) {
        status = '阴天'
        imgUrl = require('@/assets/dark.png')
      } else if ((codeNum >= 3 && codeNum <= 11) || (codeNum >= 21 && codeNum <= 25) || codeNum === 301) {
        status = '雨天'
        imgUrl = require('@/assets/rainy.png')
      } else if((codeNum >= 13 && codeNum <= 17) || (codeNum >= 26 && codeNum <= 28) || codeNum === 302) {
        status = '下雪'
        imgUrl = require('@/assets/snowy.png')
      } else if([18, 49, 57, 58].includes(codeNum)) {
        status = '雾天'
        imgUrl = require('@/assets/foggy.png')
      } else if ([20, 29, 30, 31].includes(codeNum)) {
        status = '沙尘暴'
        imgUrl = require('@/assets/sandy.png')
      } else if(codeNum >= 5 && codeNum <= 56) {
        status = '雾霾'
        imgUrl = require('@/assets/hazy.png')
      }
      return { status, imgUrl } // 返回格式化后的status和imgUrl
    },
  }
}
</script>

<style lang="less" scoped>
.main-container {
  margin-top: 16px;
  .current, .forecast, .detail {
    width: 88%;
    margin: 16px auto;
  }
  .current {
    height: 220px;
    display: flex;
    justify-content: space-around;
    .left-area {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      color: #0d47a1;
      text-align: center;
      font-size: 32px;
    }
    .right-area {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .forecast {
    height: 80px;
    display: flex;
    justify-content: center;
    gap: 16px;
    .today-area, .tomorrow-area {
      width: 100%;
      padding: 8px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .header {
        display: flex;
        justify-content: space-between;
        .status {
          font-weight: 600;
        }
      }
      .temperature {
        font-weight: 600;
        .lowest {
          color: #00ae66;
        }
        .highest {
          color: #cb0101
        }
      }
    }
  }
  .detail {
    height: 220px;
    .detail-item {
      height: 110px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      border-right: 1px solid #f2f2f2;
      border-top: 1px solid #f2f2f2;
      .value {
        font-size: 24px;
        color: #0d47a1;
        .unit {
          font-size: 12px;
          color: #666666;
        }
      }
    }
  }
}

.card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 5px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
</style>
