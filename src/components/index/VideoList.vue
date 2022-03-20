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
        :initialSlide="swiperOption.initialSlide"
        v-if="flag"
      >
        <!-- 幻灯内容 -->
        <!-- 循环输出 -->
        <swiper-slide v-for="(item, index) in videoList" :key="item.id">
          <div class="video-box">
            <!-- ref：节点 -->
            <videos ref="videos" :videoList="item" :index="index" :initialSlide="swiperOption.initialSlide"></videos>
          </div>
          <div class="infobar-warp">
            <info-bar></info-bar>
          </div>
          <div class="right-warp">
            <!-- 接收RightBar.vue穿过来的方法 -->
            <right-bar :video="item" @changeCom="showCom(item.id)" @changeLike="changeLike"></right-bar>
          </div>
          <div class="like-box" v-if="showLike">
            <div class="like"></div>
          </div>
        </swiper-slide>
        <!-- <swiper-slide>slide2</swiper-slide>
      <swiper-slide>slide1</swiper-slide>
      <swiper-slide>slide2</swiper-slide> -->
      </swiper>
    </van-pull-refresh>
    <!-- 评论 -->
    <transition name="up">
      <div class="comment-warp" v-if="showComment">
        <div class="comment-list">
          <div class="comment-top">
            <div class="number">15.0w评论</div>
            <div class="close" @click="close"><span>x</span></div>
          </div>

          <div class="comment-body">
            <div class="comment-box">
              <div class="comment-item">
                <div class="user-pic"><img src="../../assets/img/xxx.jpeg" /></div>
                <div class="item-info">
                  <div class="reply">
                    <p class="name">测试员</p>
                    <p class="reply-des">这是一段评论测试内容这是一段评论测试内容这是一段评论测试内容这是一段评论测试内容</p>
                    <p class="time">04-20</p>
                  </div>
                  <div class="zan">
                    <span class="iconfont icon-aixin"></span>
                    <p>200</p>
                  </div>
                </div>
              </div>
              <!-- 评论框 -->
              <div class="reply-input">
                <input type="text" name="" id="" placeholder="留下你的精彩评论" />
                <span class="at1">@</span>
                <span class="iconfont icon-pinglun"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, reactive, toRefs, nextTick, onBeforeUpdate, onUpdated } from 'vue'
//导入swiper组件'
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue'
//导入播放组件
import Videos from '@/components/index/Videos'
import InfoBar from '@/components/index/InfoBar'
import RightBar from '@/components/index/RightBar'
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
  },
  data() {
    return {
      showComment: false,
      // 记录当前视频为第几个
      page: 1,
      swiperOption: {
        // 高度设置，占满设备高度
        height: window.innerHeight,
        initialSlide: 2,
      },
      params: {
        page: 0,
        rows: 4,
      },
      videoList: [],
      showLike: false,
      loading: false,
      flag: false,
    }
  },
  methods: {
    async onRefresh() {
      this.params.page = 0
      this.page = 1
      this.videoList = []
      await this.setVideoList(this.params)
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
    showCom(id) {
      this.showComment = true
      console.log(id)
    },
    // 点赞特效
    changeLike() {
      this.showLike = !this.showLike
      setTimeout(() => {
        this.showLike = !this.showLike
      }, 500)
    },
    close() {
      this.showComment = false
    },
    tap(e) {
      // console.log('tap事件')
      if (this.showComment) {
        this.close()
      } else {
        this.playAction(this.page - 1)
      }
    },
    doubleTap() {
      console.log('双击')
    },
    // 暂停视频
    checkPlay() {
      const playing = this.$refs.videos[this.page - 1].playing
      if (playing) {
        this.$refs.videos[this.page - 1].stop()
      }
    },
    slideNextTransitionStart() {
      console.log('调用了下滑')
      if (this.swiperOption.initialSlide !== 0) {
        // 设置当前页码
        this.page = this.swiperOption.initialSlide
        this.swiperOption.initialSlide = 0
      }
      this.page += 1
      this.nextVideo(this.page - 1)
      // 记住，this.page是1开头的
      if (this.page === this.videoList.length - 1) {
        this.params.page++
        this.setVideoList(this.params)
      }
    },
    slidePrevTransitionStart() {
      if (this.page > 1) {
        this.page -= 1
        this.preVideo(this.page - 1)
      }
    },
    // 添加视频视频
    async setVideoList(params) {
      const result = await getVideoList(params)
      if (result.length === 0) return
      result.forEach((video) => {
        this.videoList.push(video)
      })
      this.flag = true
    },
  },
  created() {
    this.setVideoList(this.params)
  },
  activated() {
    // this.tap()
    this.playAction(this.page - 1)
  },
  deactivated() {
    // this.tap()
    this.$refs.videos[this.page - 1].stop()
  },
  // setup(props) {
  //   let videos = reactive([])
  //   const setItemRef = (el) => {
  //     // if (el && videos.length < 4) {
  //     if (el) {
  //       // console.log(el.index)
  //       // console.log(videos)
  //       videos.push(el)
  //     }
  //   }
  //   onBeforeUpdate(() => {
  //     videos = []
  //   })
  //   nextTick(() => {
  //     console.dir(videos)
  //   })
  //   const dataList = reactive({
  //     showComment: false,
  //     page: 1,
  //     swiperOption: {
  //       // 高度设置，占满设备高度
  //       height: window.innerHeight,
  //     },
  //     videoList: [
  //       {
  //         id: '1',
  //         url: 'http://video.jishiyoo.com/3720932b9b474f51a4cf79f245325118/913d4790b8f046bfa1c9a966cd75099f-8ef4af9b34003bd0bc0261cda372521f-ld.mp4',
  //       },
  //       {
  //         id: '2',
  //         url: 'http://video.jishiyoo.com/1eedc49bba7b4eaebe000e3721149807/d5ab221b92c74af8976bd3c1473bfbe2-4518fe288016ee98c8783733da0e2da4-ld.mp4',
  //       },
  //       {
  //         id: '3',
  //         url: 'http://video.jishiyoo.com/549ed372c9d14b029bfb0512ba879055/8e2dc540573d496cb0942273c4a4c78c-15844fe70971f715c01d57c0c6595f45-ld.mp4',
  //       },
  //       {
  //         id: '4',
  //         url: 'http://video.jishiyoo.com/161b9562c780479c95bbdec1a9fbebcc/8d63913b46634b069e13188b03073c09-d25c062412ee3c4a0758b1c48fc8c642-ld.mp4',
  //       },
  //     ],
  //   })
  //   const tap = (e) => {
  //     console.log('tap事件')
  //     if (dataList.showComment) {
  //       close()
  //     } else {
  //       playAction(dataList.page - 1)
  //     }
  //   }
  //   const playAction = (index) => {
  //     videos[index].playOrStop()
  //   }
  //   //上滑
  //   const nextVideo = (index) => {
  //     //通过DOM元素来获取子组件的方法
  //     //上一个视频停止
  //     videos[index - 1].stop()
  //     //下一个视频开始
  //     videos[index].play()
  //   }
  //   //下滑
  //   const preVideo = (index) => {
  //     videos[index + 1].stop()
  //     videos[index].play()
  //   }
  //   const slideNextTransitionStart = (swiper) => {
  //     dataList.page += 1
  //     nextVideo(dataList.page - 1)
  //     console.log(dataList.page)
  //     if (dataList.page === 3) {
  //       console.log('添加视频')
  //       dataList.videoList.push({
  //         id: '5',
  //         url: 'http://video.jishiyoo.com/3720932b9b474f51a4cf79f245325118/913d4790b8f046bfa1c9a966cd75099f-8ef4af9b34003bd0bc0261cda372521f-ld.mp4',
  //       })
  //     }
  //   }
  //   const slidePrevTransitionStart = () => {
  //     if (dataList.page > 1) {
  //       dataList.page -= 1
  //       preVideo(dataList.page - 1)
  //       console.log(dataList.page)
  //     }
  //   }
  //   //弹出评论
  //   const showCom = () => {
  //     dataList.showComment = true
  //   }
  //   const close = () => {
  //     dataList.showComment = false
  //   }
  //   return {
  //     setItemRef,
  //     ...toRefs(dataList),
  //     tap,
  //     playAction,
  //     nextVideo,
  //     preVideo,
  //     slideNextTransitionStart,
  //     slidePrevTransitionStart,
  //     showCom,
  //     close,
  //   }
  // },
}
</script>

<style lang="less" scoped>
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
.infobar-warp {
  position: absolute;
  bottom: 50px;
  left: 0;
}
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
/* 评论 */
.up-enter-active,
.up-leave-active {
  transition: all 0.5s;
}
.up-enter-from, .up-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 1;
  transform: translateY(100%);
}

.comment-warp {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 500px;
  width: 100%;
  background: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  z-index: 999;
  padding: 10px 10px;
  box-sizing: border-box;
  font-size: 16px;
}
.comment-top {
  display: flex;
  align-items: center;
}
.number {
  flex-grow: 1;
  text-align: center;
}
.close {
  padding-right: 10px;
  font-size: 30px;
  color: #666;
}
.comment-body {
  max-width: 450px;
  overflow: auto;
  margin-top: 20px;
}
.comment-item {
  display: flex;
}
.user-pic {
  width: 25%;
  // height: 30px;
  img {
    width: 100%;
    border-radius: 50%;
  }
}
.item-info {
  display: flex;
  margin: 0 5px 0 10px;
  // flex: 1 1 auto;
  .reply {
    width: 90%;
    .name {
      color: #666;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .reply-des {
      line-height: 24px;
    }
    .time {
      color: #666;
    }
  }
}
.zan {
  text-align: center;
  .iconfont {
    font-size: 20px;
  }
  p {
    color: #cccccc;
    margin-top: 5px;
  }
}

.reply-input {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  input {
    line-height: 40px;
    width: 70%;
    border: none;
    padding: 0 10px;
  }
  .at1 {
    font-size: 30px;
    color: #cccccc;
    margin-right: 8%;
  }
  .iconfont {
    font-size: 30px;
    color: #cccccc;
  }
}
</style>
