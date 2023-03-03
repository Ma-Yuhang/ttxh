<template>
  <div>
    <keep-alive exclude="Search,SearchResult,Detail">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
<style lang="less">
</style>
