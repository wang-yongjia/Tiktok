<template>
  <div class="indexwarp">
    <!-- 首页 -->
    <top-bar></top-bar>
    <tab-bar></tab-bar>
  </div>
</template>

<script>
import TopBar from '@/components/index/TopBar'
import TabBar from '@/components/TabBar'
export default {
  name: 'index',
  components: {
    TopBar,
    TabBar,
  },
  setup(props) {},
}
</script>

<style lang="less" scoped>
.indexwarp {
  height: 100%;
  background: #000;
}
</style>
