<template>
  <div class="top-bar">
    <van-tabs v-model:active="active" sticky offset-top="1" lazy-render background="transparent" title-active-color="white" title-inactive-color="#cccccc" @change="changeTab">
      <van-tab title="关注">
        <video-list ref="attention"></video-list>
      </van-tab>
      <van-tab title="推荐">
        <video-list ref="recommend"></video-list>
      </van-tab>
      <template #nav-left>
        <div class="nav-icon">
          <van-icon name="video-o" color="white" size="0.8rem" />
        </div>
      </template>
      <template #nav-right>
        <div class="nav-icon">
          <van-icon name="search" color="white" size="0.8rem" />
        </div>
      </template>
    </van-tabs>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import VideoList from '@/components/index/VideoList'
export default {
  name: 'topbar',
  components: {
    VideoList,
  },
  setup(props, { emit }) {
    const attention = ref(null)
    const recommend = ref(null)
    const dataList = reactive({
      active: 1,
    })
    const changeTab = (index) => {
      // 关注
      if (index === 0) {
        recommend.value.checkPlay()
        // 渲染dom后才调用播放
        if (attention.value) attention.value.tap()
      } else if (index === 1) {
        // 推荐，先暂停关注页面的视频，再播放推荐页面的视频
        attention.value.checkPlay()
        recommend.value.tap()
      }
    }
    return {
      attention,
      recommend,
      ...toRefs(dataList),
      changeTab,
    }
  },
}
</script>

<style lang="less" scoped>
.top-bar {
  height: 100%;
}
// 设置tab脱离文档流，不影响下面布局
/deep/ .van-tabs__wrap {
  position: absolute;
  width: 100%;
  z-index: 999;
  .van-tabs__nav {
    display: flex;
    justify-content: space-around;
  }
}
// /deep/.van-tabs__content {
//   height: 100%;
// }
/deep/.van-tab__text {
  font-size: 18px;
}
/deep/.van-tabs__line {
  background-color: white;
}
.nav-icon {
  display: flex;
  justify-content: center;
  align-self: center;
  width: 20%;
}
</style>
