<template>
  <div class="friend">
    <user-header title="朋友"></user-header>
    <div class="friedn-warp">
      <van-search v-model="searchValue" placeholder="请输入搜索关键词" background="transparent" @search="onSearch" autocomplete="off" />
      <van-swipe-cell v-for="item in userList" :key="item.id">
        <van-card :desc="item.introduction" :title="item.name" centered class="goods-card" @click="home(item.id)">
          <template #thumb>
            <van-image width="1.5rem" height="1.5rem" round fit="cover" position="center" style="border: 2px solid white" :src="item.avatar_url" />
          </template>
        </van-card>
        <template #right>
          <van-button square text="取关" type="danger" class="delete-button" />
        </template>
      </van-swipe-cell>
    </div>
    <tab-bar></tab-bar>
  </div>
</template>

<script>
import userHeader from '@/components/header/userHeader'
import TabBar from '@/components/TabBar'
import { reactive, toRefs } from 'vue'
import { getMyFollow, getMyFollowBySearch } from '@/api/user'
import { useSessionStorage } from '@/hooks/sessionStorage'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'

export default {
  components: {
    userHeader,
    TabBar,
  },
  setup(props) {
    const router = new useRouter()
    const dataList = reactive({
      searchValue: '',
      userId: useSessionStorage('user').id,
      userList: [],
    })
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
    const onSearch = (val) => {
      console.log(val)
      if (val.trim().length === 0) {
        init()
      }
      getMyFollowBySearch({ userId: dataList.userId, searchValue: val }).then((res) => {
        dataList.userList = res
      })
    }
    const init = () => {
      getMyFollow(dataList.userId).then((res) => {
        dataList.userList = res
      })
    }
    init()
    return {
      ...toRefs(dataList),
      home,
      onSearch,
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
