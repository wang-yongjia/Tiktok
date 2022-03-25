<template>
  <div class="friend">
    <user-header title="消息"></user-header>
    <div class="friedn-warp">
      <van-card v-for="item in userList" :key="item.id" :desc="item.introduction" :title="item.name" centered class="goods-card" @click="toChat(item.id)">
        <template #thumb>
          <van-image width="1.5rem" height="1.5rem" round fit="cover" position="center" style="border: 2px solid white" :src="item.avatar_url" @click.stop="home(item.id)" />
        </template>
      </van-card>
    </div>
    <tab-bar></tab-bar>
  </div>
</template>

<script>
import userHeader from '@/components/header/userHeader'
import TabBar from '@/components/TabBar'
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { getMutualFollow } from '@/api/user'
import { useSessionStorage } from '@/hooks/sessionStorage'

export default {
  components: {
    userHeader,
    TabBar,
  },
  setup(props) {
    const router = new useRouter()
    const dataList = reactive({
      userId: useSessionStorage('user').id,
      userList: [],
    })
    // 跳转聊天界面
    const toChat = (toUserId) => {
      router.push({
        path: '/chat',
        query: {
          toUserId,
        },
      })
    }
    // 跳转主页
    const home = (toUserId) => {
      router.push({
        path: '/home',
        query: {
          userId: toUserId,
          isFollow: true,
        },
      })
    }
    const init = () => {
      getMutualFollow(dataList.userId).then((res) => {
        dataList.userList = res
      })
    }
    init()
    return {
      ...toRefs(dataList),
      toChat,
      home,
    }
  },
}
</script>

<style lang="less" scoped>
.friend {
  height: 100%;
  background-color: #101821;
}
// 滑动样式
.goods-card {
  margin: 0;
  background-color: transparent;
}
.delete-button {
  height: 100%;
}
/deep/.van-card {
  height: 80px;
  .van-card__header {
    height: 100%;
    .van-card__thumb {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 80px;
    }
    .van-card__content {
      min-height: 0;
      border-bottom: 1px solid #555555;
      .van-card__title {
        color: white;
        font-size: 16px;
      }
      .van-card__desc {
        font-size: 14px;
        transform: translateY(10px);
      }
    }
  }
}
</style>
