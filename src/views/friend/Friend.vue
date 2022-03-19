<template>
  <div class="friend">
    <user-header title="朋友" rightText="发起聊天" @onClickRight="onClickRight"></user-header>
    <div class="friedn-warp">
      <van-search v-model="searchValue" placeholder="请输入搜索关键词" background="transparent" />
      <van-swipe-cell>
        <van-card desc="描述信息描述信息描述信息描述信息描述信息" title="heart" centered class="goods-card">
          <template #thumb>
            <van-image width="1.5rem" height="1.5rem" round fit="cover" position="center" src="https://img.yzcdn.cn/vant/cat.jpeg" />
          </template>
        </van-card>
        <template #right>
          <van-button square text="删除" type="danger" class="delete-button" />
        </template>
      </van-swipe-cell>
      <van-swipe-cell>
        <van-card desc="描述信息描述信息描述信息描述信息描述信息" title="商品标题" centered class="goods-card">
          <template #thumb>
            <van-image width="1.5rem" height="1.5rem" round fit="cover" position="center" src="https://img.yzcdn.cn/vant/cat.jpeg" />
          </template>
        </van-card>
        <template #right>
          <van-button square text="删除" type="danger" class="delete-button" />
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
export default {
  components: {
    userHeader,
    TabBar,
  },
  setup(props) {
    const dataList = reactive({
      searchValue: '',
    })
    const onClickRight = () => {
      console.log('onClickRight')
    }

    return {
      ...toRefs(dataList),
      onClickRight,
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
