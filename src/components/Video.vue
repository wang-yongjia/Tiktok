<template>
  <div class="video">
    <van-list :finished="finished" finished-text="没有更多了">
      <van-image v-for="(item, index) in videoList" :key="index" width="33.3%" height="4rem" fit="cover" position="center" :src="item.preview_url" @click="play(item, index)" />
    </van-list>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { useSessionStorage } from '@/hooks/sessionStorage'
import { useRouter } from 'vue-router'
export default {
  props: {
    videoList: {
      type: Array,
    },
  },
  setup(props) {
    const router = useRouter()
    const dataList = reactive({
      finished: true,
    })
    const play = (video, index) => {
      useSessionStorage('videoList', props.videoList)
      router.push({
        path: '/video',
        query: {
          initialSlide: index,
        },
      })
    }
    return {
      ...toRefs(dataList),
      play,
    }
  },
}
</script>

<style lang="less" scoped>
.van-image {
  border: 1px solid white;
  border-top: 0;
  vertical-align: top;
}
/deep/.van-list {
  margin-bottom: var(--van-tabbar-height);
}
</style>
