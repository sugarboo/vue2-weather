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
