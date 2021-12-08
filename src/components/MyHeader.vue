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
