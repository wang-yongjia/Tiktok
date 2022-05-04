<template>
  <div class="right-bar">
    <div class="rightbar-item">
      <van-image round fit="cover" position="center" width="1.8rem" height="1.8rem" :src="video.user.avatar_url" @touchstart.stop="home(video.user.id, video.isFollow)" />
      <van-icon name="add" size="0.6rem" v-if="!video.isFollow && video.user.id !== userId && userId !== 0" @touchstart.stop="home(video.user.id, video.isFollow)" />
    </div>
    <div class="item-icon">
      <van-icon name="like" @touchstart.stop="changeLike" :class="{ active: isLike, deactive: !isLike }" size="1.1rem" />
      <p>{{ videoLike }}</p>
    </div>
    <div class="item-icon" @touchstart.stop="showCom">
      <van-icon name="chat-o" size="1.1rem" color="white" />
      <p>{{ video.comment }}</p>
    </div>
    <div class="item-icon" @touchstart.stop="dowloadVideo">
      <van-icon name="down" size="1.1rem" color="white" />
    </div>
    <div class="rightbar-item" @touchstart.stop>
      <div class="right-music">
        <img src="../../assets/img/xxx.jpeg" />
      </div>
    </div>
    <div class="like-box" v-if="showLike">
      <div class="like"></div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { videoLike, videoUnlike } from '@/api/user'
import { useRouter } from 'vue-router'
import { useSessionStorage } from '@/hooks/sessionStorage'

export default {
  props: {
    video: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const router = useRouter()
    const dataList = reactive({
      showLike: false,
      isLike: props.video.isLike ? true : false,
      videoLike: props.video.video_like,
      userId: useSessionStorage('user') ? useSessionStorage('user').id : 0,
    })
    const showCom = () => {
      // 不加延迟弹出层会自动关闭，不清楚为什么
      setTimeout(() => {
        emit('changeCom')
      }, 150)
    }
    const changeLike = async () => {
      const userId = useSessionStorage('user').id
      const videoId = props.video.id
      dataList.isLike = !dataList.isLike
      if (dataList.isLike) {
        const result = await videoLike({ userId, videoId })
        dataList.videoLike++
        emit('changeLike')
      } else {
        const result = await videoUnlike({ userId, videoId })
        dataList.videoLike--
      }
    }
    const dowloadVideo = () => {
      // 后续改为系统变量
      const url = `http://localhost:8888/video/dowload/${props.video.filename}`
      window.open(url)
      // const el = document.createElement('a')
      // el.style.display = 'none'
      // el.setAttribute('target', '_blank')
      // /**
      //  * download的属性是HTML5新增的属性
      //  * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
      //  * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
      //  * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
      //  */
      // el.href = url
      // document.body.appendChild(el)
      // el.click()
      // document.body.removeChild(el)
    }
    const home = (toUserId, isFollow) => {
      if (toUserId === dataList.userId) {
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
      ...toRefs(dataList),
      showCom,
      changeLike,
      dowloadVideo,
      home,
    }
  },
}
</script>

<style lang="less" scoped>
.like-box {
  width: 200px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .like {
    width: 100%;
    height: 100%;
    background: url(../../assets/like.png) no-repeat;
    background-position: left;
    background-size: cover;
    animation: heart-animated 0.5s 1 steps(28);
    animation-fill-mode: forwards; //动画完成后，保持最后一个属性值
  }
  @keyframes heart-animated {
    0% {
      background-position: left;
    }
    100% {
      background-position: right;
    }
  }
}
.deactive {
  color: white;
}
.active {
  color: #fe2c55;
}
.rightbar-item {
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-bottom: 15px;
}
/deep/.van-icon-add {
  position: absolute;
  top: 1.5rem;
  color: #fe2c55;
  font-weight: 900;
}
/deep/.van-image {
  border: 2px solid white;
  box-sizing: border-box;
}
.item-icon {
  height: 65px;
  text-align: center;
  p {
    color: #ffffff;
    font-size: 14px;
  }
}
.right-music {
  height: 54px;
  width: 54px;
  background: #2e2e2e;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: round 6s 0s linear infinite;
  img {
    height: 30px;
    width: 30px;
    border-radius: 50%;
  }
  @keyframes round {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
