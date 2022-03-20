<template>
  <div class="video">
    <van-image v-for="(item, index) in videoList" :key="index" width="33.3%" height="4rem" fit="cover" position="center" :src="avatarUrl" @click="play(item)" />
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  props: {
    videoList: {
      type: Array,
    },
  },
  setup(props) {
    const avatarUrl = ref('http://localhost:8888/user/avatar/1647707576639.png')
    const play = (video) => {
      console.log('play', video)
    }
    return { avatarUrl, play }
  },
}
</script>

<style lang="less" scoped>
.van-image {
  border: 1px solid white;
  border-top: 0;
  vertical-align: top;
}
</style>
