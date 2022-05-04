<template>
  <div class="info-bar" @touchstart.stop>
    <div class="infobar-item">
      <span @click="home(video.user.id, video.isFollow)">@ {{ video.user.name }}</span>
    </div>
    <div class="infobar-item">
      <span>{{ video.video_desc }}</span>
    </div>
    <div class="infobar-item music-item">
      <span class="iconfont icon-yinfu"></span>
      <div class="music-name">
        <span> 0基础，学IT，月薪过万，就来黑马程序员</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useSessionStorage } from '@/hooks/sessionStorage'
import { useRouter } from 'vue-router'
export default {
  props: {
    video: {
      type: Object,
    },
  },
  setup(props) {
    const router = useRouter()
    const home = (toUserId, isFollow) => {
      let userId = useSessionStorage('user') ? useSessionStorage('user').id : 0
      if (toUserId === userId) {
        router.push('/me')
      } else {
        router.push({
          path: '/home',
          query: {
            userId: toUserId,
            isFollow: isFollow,
          },
        })
      }
    }

    return {
      home,
    }
  },
}
</script>

<style lang="less" scoped>
.info-bar {
  color: #ffffff;
  font-size: 16px;
  padding-left: 10px;
}
.infobar-item {
  padding: 6px 0;
}
.infobar-item > .icon-yinfu {
  margin-right: 5px;
}
.music-item {
  display: flex;
}
.music-name {
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
}
.music-name > span {
  display: inline-block;
  animation: scroll 5s linear infinite;
}
.music-name > span::after {
  content: attr(data-text);
  margin-left: 30px;
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-50% - 20px));
  }
}
</style>
