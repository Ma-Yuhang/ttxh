<template>
  <div>
    <div class="home_container">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <!-- 底部导航 -->
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" :to="{name:'home'}">首页</van-tabbar-item>
      <van-tabbar-item icon="setting-o" :to="{name:'user'}">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      active: 0,
    };
  },
  activated() {
    this.active = this.$route.path == '/layout/home' ? 0 : 1
  }
}
</script>

<style lang="less" scoped>
.home_container {
  margin-bottom: 50px;
}
.van-tabber {
  border-top: 1px solid #f8f8f8;
}
</style>