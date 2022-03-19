<template>
  <div class="videos">
    <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
    <van-icon name="play" v-if="!playing" />
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player/src'
import { ref, reactive, onMounted } from 'vue'
export default {
  name: 'Videos',
  components: {
    videoPlayer,
  },
  //子组件接收父组件(VideoList)
  props: ['videoList', 'index'],
  setup(props) {
    const videoPlayer = ref(null)
    const playing = ref(true)
    const playerOptions = reactive({
      autoplay: false, //如果true,浏览器准备好时开始回放。
      muted: true, // 默认情况下将会消除任何音频。
      loop: true, // 导致视频一结束就重新开始。
      preload: 'auto',
      fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      sources: [
        {
          src: props.videoList.file_url, // 路径
          type: 'video/mp4', // 类型
        },
      ],
      // poster: require('../../assets/logo.png'),
      width: document.documentElement.clientWidth,
      notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
      controlBar: false,
    })
    const playOrStop = () => {
      if (playing.value) {
        videoPlayer.value.player.pause()
        playing.value = false
      } else {
        videoPlayer.value.player.play()
        playing.value = true
      }
    }
    const autoPlayAction = () => {
      //自动播放第一个视频
      if (props.index == 0) {
        playerOptions.autoplay = true
      }
    }
    const play = () => {
      //重新载入
      videoPlayer.value.player.load()
      videoPlayer.value.player.play()
      playing.value = true
    }
    const stop = () => {
      videoPlayer.value.player.pause()
      playing.value = false
    }
    // 初始化
    autoPlayAction()
    return {
      videoPlayer,
      playing,
      playerOptions,
      playOrStop,
      autoPlayAction,
      play,
      stop,
    }
  },
}
</script>

<style lang="less" scoped>
/deep/.van-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #cccccc;
  font-size: 80px;
}
</style>
<style>
.videos {
  position: relative;
}
/* .videos .vjs-custom-skin > .video-js .vjs-big-play-button { */
.videos .vjs-big-play-button {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
}
</style>
