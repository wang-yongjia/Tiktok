<template>
  <div class="video-list">
    <van-pull-refresh v-model="loading" @refresh="onRefresh" :disabled="page !== 1">
      <swiper
        direction="vertical"
        :grabCursor="true"
        :setWrapperSize="true"
        :autoHeight="true"
        :slidesPerView="1"
        :mousewheel="true"
        :mousewheelControl="true"
        :resistanceRatio="this.page === 1 ? 0 : 0.85"
        :observeParents="true"
        :observer="true"
        :height="swiperOption.height"
        @tap="tap($event)"
        @doubleTap="doubleTap"
        @slideNextTransitionStart="slideNextTransitionStart"
        @slidePrevTransitionStart="slidePrevTransitionStart"
        :initialSlide="initialSlide"
      >
        <!-- 幻灯内容 -->
        <!-- 循环输出 -->
        <swiper-slide v-for="(item, index) in videoList" :key="item.id">
          <div class="video-box">
            <!-- ref：节点 -->
            <videos ref="videos" :videoList="item" :index="index" :initialSlide="initialSlide"></videos>
          </div>
          <div class="infobar-warp">
            <info-bar :video="item"></info-bar>
          </div>
          <div class="right-warp">
            <!-- 接收RightBar.vue穿过来的方法 -->
            <right-bar :video="item" @changeCom="showCom(item)" @changeLike="changeLike"></right-bar>
          </div>
          <div class="like-box" v-if="showLike">
            <div class="like"></div>
          </div>
        </swiper-slide>
      </swiper>
    </van-pull-refresh>
    <!-- 评论 -->
    <van-popup v-model:show="showComment" position="bottom" :style="{ height: '70%' }" round closeable>
      <Comment :videoInfo="videoInfo" v-if="showComment"></Comment>
    </van-popup>
  </div>
</template>

<script>
//导入swiper组件'
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue'
//导入播放组件
import Videos from '@/components/index/Videos'
import InfoBar from '@/components/index/InfoBar'
import RightBar from '@/components/index/RightBar'
import Comment from '@/components/Comment'
import { getVideoList } from '@/api/video'
import { Toast } from 'vant'
export default {
  name: 'videolist',
  components: {
    Swiper,
    SwiperSlide,
    Videos,
    InfoBar,
    RightBar,
    Comment,
  },
  props: {
    videoList: {
      type: Array,
    },
    initialSlide: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      swiperOption: {
        height: window.innerHeight, // 高度设置，占满设备高度
        initialSlide: 0, // 用于下滑时判断，没什么用
      },
      params: {
        page: 0,
        rows: 4,
      },
      page: 1, // 记录当前视频为第几个
      showComment: false, // 评论显示
      showLike: false, // 点赞动画显示
      loading: false, // 刷新图标显示
      videoInfo: 0,
    }
  },
  methods: {
    async onRefresh() {
      this.page = 1
      await this.$emit('refreshVideo')
      Toast('刷新成功')
      this.loading = false
    },
    playAction(index) {
      this.$refs.videos[index].playOrStop()
    },
    //上滑
    nextVideo(index) {
      //通过DOM元素来获取子组件的方法
      //上一个视频停止
      this.$refs.videos[index - 1].stop()
      //下一个视频开始
      this.$refs.videos[index].play()
    },
    //下滑
    preVideo(index) {
      this.$refs.videos[index + 1].stop()
      this.$refs.videos[index].play()
    },
    //弹出评论
    showCom(videoInfo) {
      this.videoInfo = videoInfo
      this.showComment = true
    },
    // 点赞特效
    changeLike() {
      this.showLike = !this.showLike
      setTimeout(() => {
        this.showLike = !this.showLike
      }, 500)
    },
    tap(e) {
      // console.log('tap事件')
      this.playAction(this.page - 1)
    },
    doubleTap() {
      // console.log('双击')
    },
    // 暂停视频
    checkPlay() {
      const playing = this.$refs.videos[this.page - 1].playing
      if (playing) {
        this.$refs.videos[this.page - 1].stop()
      }
    },
    slideNextTransitionStart() {
      // console.log('调用了下滑')
      if (this.swiperOption.initialSlide !== 0) {
        // 设置当前页码
        this.page = this.swiperOption.initialSlide
        this.swiperOption.initialSlide = 0
      }
      this.page += 1
      this.nextVideo(this.page - 1)
      // 记住，this.page是1开头的
      if (this.page === this.videoList.length - 1) {
        this.$emit('addVideo')
      }
    },
    slidePrevTransitionStart() {
      if (this.page > 1) {
        this.page -= 1
        this.preVideo(this.page - 1)
      }
    },
  },
  created() {
    // console.log(this.videoList)
    this.swiperOption.initialSlide = this.initialSlide
  },
  // 在这里调用会导致两边视频同时播放，改到topBar组件调用
  activated() {
    // this.playAction(this.page - 1)
  },
  deactivated() {
    // this.tap()
    this.$refs.videos[this.page - 1].stop()
  },
}
</script>

<style lang="less" scoped>
.comment-input {
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: #dddddd 1px solid;
}
.video-list {
  height: 100%;
}
.swiper {
  position: relative;
  height: 100%;
}
// 如果页面高度大于视频自适应高度，则把视频居中
.video-box {
  height: 100%;
  .videos {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
}
// 评论标题
.comment-title {
  font-size: 20px;
  line-height: 40px;
  text-align: center;
  margin-bottom: 20px;
}
.comment-info {
  display: flex;
  .comment-avatar {
    width: 20%;
    text-align: center;
  }
  .comment-content {
    width: 80%;
    font-size: 16px;
    .name {
      font-size: 15px;
      margin-bottom: 5px;
    }
    .content {
      color: black;
      line-height: 25px;
    }
    .time {
      font-size: 14px;
      color: #cccccc;
      margin-top: 5px;
    }
    .more {
      text-align: center;
      font-size: 14px;
      color: #666666;
    }
  }
  .comment-like {
    width: 20%;
    text-align: center;
    color: #aaaaaa;
    p {
      font-size: 14px;
    }
  }
}
// 底部提示样式
.infobar-warp {
  position: absolute;
  bottom: 50px;
  left: 0;
}
// 右边栏样式
.right-warp {
  position: absolute;
  bottom: 100px;
  right: 10px;
  z-index: 999;
}
// 喜欢
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
</style>
