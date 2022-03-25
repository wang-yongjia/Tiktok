<template>
  <div class="search-container">
    <div class="search-input">
      <van-icon name="arrow-left" @click="$router.back()" />
      <van-search v-model="searchValue" clearable placeholder="请输入搜索关键词" @search="onSearch" show-action>
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </div>
    <div class="search" v-for="(item, index) in videoList" :key="index" v-show="videoList.length > 0">
      <div class="info">
        <div class="avatar">
          <van-image width="1rem" height="1rem" fit="cover" round position="center" :src="item.user.avatar_url" />
        </div>
        <div class="content">
          <div class="name">{{ item.user.name }}</div>
          <div class="time">{{ commentDate(item.createAt) }}</div>
        </div>
      </div>
      <div class="desc">
        <p>{{ item.video_desc }}</p>
        <van-image fit="cover" width="100%" position="center" :src="item.preview_url" @click="playVideo(index)" />
      </div>
    </div>
    <van-empty image="search" description="没有更多了" v-if="videoList.length === 0" />
  </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import moment from 'moment'
import { getVideoListBySearchValue } from '@/api/video'
import { useSessionStorage } from '@/hooks/sessionStorage'

export default {
  setup(props) {
    const router = new useRouter()
    const dataList = reactive({
      searchValue: '',
      videoList: [],
    })
    let commentDate = computed(() => {
      return function (createDate) {
        return moment(createDate).format('YYYY-MM-DD HH:mm:ss')
      }
    })
    const onSearch = () => {
      if (!dataList.searchValue) {
        Toast('请输入关键词')
        return
      }
      const params = {
        userId: useSessionStorage('user').id,
        searchValue: dataList.searchValue,
      }
      getVideoListBySearchValue(params).then((res) => {
        dataList.videoList = res
        console.log(res)
      })
    }
    const playVideo = (index) => {
      useSessionStorage('videoList', dataList.videoList)
      router.push({
        path: '/video',
        query: {
          initialSlide: index,
        },
      })
    }

    return {
      ...toRefs(dataList),
      commentDate,
      onSearch,
      playVideo,
    }
  },
}
</script>

<style lang="less" scoped>
.search-container {
  background-color: #eee;
}
/deep/.van-empty {
  background-color: white;
}
.search-input {
  display: flex;
  align-items: center;
  background-color: white;
  /deep/.van-icon-arrow-left {
    width: 10%;
    transform: translateX(5px);
  }
  /deep/.van-search {
    width: 90%;
    padding-left: 0;
    .van-search__action {
      color: #fe2c55;
    }
  }
}
.search {
  margin-bottom: 10px;
  padding-top: 10px;
  background-color: white;
  .info {
    display: flex;
    margin-bottom: 10px;
    .avatar {
      flex: 3;
      text-align: center;
    }
    .content {
      flex: 12;
      font-size: 16px;
      .name {
        font-size: 15px;
        margin-bottom: 5px;
      }
      .time {
        font-size: 14px;
        color: #cccccc;
        margin-top: 5px;
      }
    }
  }
  .desc {
    padding: 0 15px;
    font-size: 16px;
    line-height: 24px;
  }
}
</style>
