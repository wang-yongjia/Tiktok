<template>
  <div class="me">
    <div class="me-top">
      <van-icon name="arrow-left" color="white" size="0.7rem" @click="$router.back()" />
    </div>
    <div class="me-wrap">
      <div class="me-content">
        <div class="info">
          <van-image width="2.5rem" height="2.5rem" round fit="cover" position="center" :src="user.avatar_url" style="border: 2px solid white" @click="showAvatar(user.avatar_url)" />
          <van-button :class="{ follow: isFollow }" @click="changeFollow"><van-icon name="plus" v-if="!isFollow" />{{ isFollow ? '已关注' : '关注' }}</van-button>
        </div>
        <div class="des">
          <h2>{{ user.name }}</h2>
          <span>抖音号：{{ user.id }}</span>
          <p>{{ user.introduction }}</p>
        </div>
        <div class="user-tag">
          <span><a href="#">20w</a>获赞</span>
          <span><a href="#">30w</a>关注</span>
          <span><a href="#">40w</a>粉丝</span>
        </div>
      </div>

      <div class="me-tab">
        <van-tabs v-model:active="active" lazy-render sticky swipeable background="transparent" title-active-color="white" title-inactive-color="#cccccc" line-width="80" @change="changeTab">
          <van-tab title="作品">
            <Video :videoList="videoList" v-if="videoList.length > 0"></Video>
          </van-tab>
          <van-tab title="喜欢">
            <Video :videoList="videoLikeList" v-if="videoLikeList.length > 0"></Video>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
  <tab-bar></tab-bar>
</template>
<script>
import { reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ImagePreview } from 'vant'
import TabBar from '@/components/TabBar'
import Video from '@/components/Video'
import { useSessionStorage } from '@/hooks/sessionStorage'
import { getUserInfoById } from '@/api/user'
import { getVideoByUserId, getVideoLikeByUserId } from '@/api/video'
import { userFollow, userUnfollow } from '@/api/user'
import { Toast } from 'vant'
export default {
  components: {
    TabBar,
    Video,
  },
  setup(props) {
    const router = new useRouter()
    const route = new useRoute()
    const dataList = reactive({
      active: 0,
      userId: route.query.userId,
      isFollow: JSON.parse(route.query.isFollow),
      user: {},
      videoList: [],
      videoLikeList: [],
    })
    // 获取用户信息
    getUserInfoById(dataList.userId).then((res) => {
      dataList.user = res
    })
    // 获取我发布的作品，后续需要增加获取喜欢、动态
    getVideoByUserId(dataList.userId).then((res) => {
      dataList.videoList = res
    })
    getVideoLikeByUserId(dataList.userId).then((res) => {
      dataList.videoLikeList = res.videoLikeList
    })
    const showAvatar = (avatarUrl) => {
      ImagePreview({
        images: [avatarUrl],
      })
    }
    const changeTab = (index) => {
      dataList.active = index
    }
    const changeFollow = async () => {
      const userData = {
        userId: useSessionStorage('user').id,
        user2Id: dataList.userId,
      }
      if (dataList.isFollow) {
        // 取消关注
        const result = await userUnfollow(userData)
        dataList.isFollow = !dataList.isFollow
      } else {
        // 关注
        const result = await userFollow(userData)
        dataList.isFollow = !dataList.isFollow
      }
    }

    return {
      ...toRefs(dataList),
      showAvatar,
      changeTab,
      changeFollow,
    }
  },
}
</script>

<style lang="less" scoped>
/deep/.van-cell-group {
  margin-top: 20px;
}
/deep/.van-tabs__line {
  background-color: #ffdf0e;
}
.me {
  position: relative;
  height: 100%;
  background-color: #101821;
  font-size: 16px;
}
.me-top {
  height: 160px;
  display: flex;
  padding: 20px;
  background-image: url('../../assets/img/bq.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  /deep/.van-icon-arrow-left {
  }
}
.me-wrap {
  position: absolute;
  top: 140px;
  width: 100%;
  background-color: #101821;
  color: #ffffff;
}
.me-content {
  padding: 0 20px;
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    /deep/.van-button {
      height: 40px;
      width: 60%;
      background-color: #fe2c55;
      border: none;
      color: white;
      font-size: 16px;
    }
    .follow {
      background-color: white;
      color: black;
    }
  }
  .des {
    padding: 20px 0;
    h2 {
      font-size: 24px;
      font-weight: bold;
    }
    span {
      padding: 10px 0 15px 0;
      /* display: block; */
    }
    p {
      line-height: 24px;
    }
  }
  .user-tag {
    span {
      font-size: 14px;
      margin-right: 15px;
      color: #cccccc;
    }
    a {
      margin-right: 5px;
      color: #cccccc;
    }
  }
}
.me-tab {
  height: 100%;
}
</style>
