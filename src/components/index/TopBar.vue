<template>
  <div class="top-bar">
    <van-tabs v-model:active="active" sticky offset-top="1" lazy-render background="transparent" title-active-color="white" title-inactive-color="#cccccc" @change="changeTab">
      <van-tab title="关注" v-if="params.userId">
        <video-list ref="attention" :videoList="attentionVideoList" :initialSlide="0" v-if="attentionVideoList.length > 0 && attentionVideoList[0].id"></video-list>
        <van-empty image="search" description="没有更多了" v-else />
      </van-tab>
      <van-tab title="推荐">
        <video-list ref="recommend" :videoList="videoList" :initialSlide="0" @addVideo="addVideo" @refreshVideo="refreshVideo" v-if="videoList.length > 0"></video-list>
      </van-tab>
      <template #nav-left>
        <div class="nav-icon">
          <van-icon name="video-o" color="white" size="0.8rem" />
        </div>
      </template>
      <template #nav-right>
        <div class="nav-icon" @click="$router.push('/search')">
          <van-icon name="search" color="white" size="0.8rem" />
        </div>
      </template>
    </van-tabs>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import VideoList from '@/components/index/VideoList'
import { getVideoList, getFollowVideoById } from '@/api/video'
import { useSessionStorage } from '@/hooks/sessionStorage'
import { useRouter } from 'vue-router'
export default {
  name: 'topbar',
  components: {
    VideoList,
  },
  setup(props, { emit }) {
    const router = new useRouter()
    const attention = ref(null)
    const recommend = ref(null)
    const dataList = reactive({
      active: 1,
      params: {
        userId: useSessionStorage('user') ? useSessionStorage('user').id : 0,
        page: 0,
        rows: 4,
      },
      videoList: [],
      attentionVideoList: [],
    })
    const changeTab = (index) => {
      // 关注
      if (index === 0) {
        if (recommend.value) recommend.value.checkPlay()
        // 渲染dom后才调用播放
        if (attention.value) attention.value.tap()
      } else if (index === 1) {
        // 推荐，先暂停关注页面的视频，再播放推荐页面的视频
        if (attention.value) attention.value.checkPlay()
        if (recommend.value) recommend.value.tap()
      }
    }
    const setVideoList = async (params) => {
      const result = await getVideoList(dataList.params)
      if (result.length === 0) return
      result.forEach((video) => {
        dataList.videoList.push(video)
      })
    }
    const addVideo = () => {
      dataList.params.page++
      setVideoList(dataList.params)
    }
    const refreshVideo = () => {
      dataList.params.page = 0
      dataList.videoList = []
      setVideoList(dataList.params)
    }
    // 设置关注的人的视频
    const setFollowVideoList = async (userId) => {
      const result = await getFollowVideoById(userId)
      if (result.length === 0) return
      result.forEach((video) => {
        dataList.attentionVideoList.push(video)
      })
    }
    // 初始化数据
    setVideoList(dataList.params)
    if (dataList.params.userId) setFollowVideoList(dataList.params.userId)
    return {
      attention,
      recommend,
      ...toRefs(dataList),
      changeTab,
      addVideo,
      refreshVideo,
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
/deep/.van-empty {
  transform: translateY(50px);
}
</style>
