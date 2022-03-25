<template>
  <div class="video-container">
    <van-nav-bar title="" left-arrow :border="false" @click-left="$router.back()"> </van-nav-bar>
    <video-list :videoList="videoList" :initialSlide="initialSlide" v-if="videoList.length > 0"></video-list>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import VideoList from '@/components/index/VideoList'
import { useSessionStorage } from '@/hooks/sessionStorage'
import { useRoute } from 'vue-router'
export default {
  name: 'topbar',
  components: {
    VideoList,
  },
  setup(props, { emit }) {
    const route = useRoute()
    const dataList = reactive({
      videoList: useSessionStorage('videoList'),
      initialSlide: parseInt(route.query.initialSlide),
    })
    return {
      ...toRefs(dataList),
    }
  },
}
</script>

<style lang="less" scoped>
.video-container {
  height: 100%;
  background-color: #101821;
}
/deep/.van-nav-bar {
  position: absolute;
  z-index: 9999;
  width: 100%;
  background-color: transparent;
}
/deep/.van-nav-bar__left .van-icon {
  color: white;
  font-size: 30px;
}
</style>
