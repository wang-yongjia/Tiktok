<template>
  <div class="tab-bar">
    <van-tabbar v-model="active" route fixed active-color="white" inactive-color="#cccccc" @change="onChange">
      <van-tabbar-item replace to="/index">首页</van-tabbar-item>
      <van-tabbar-item replace to="/friend">朋友</van-tabbar-item>
      <van-tabbar-item to="/release">
        <van-icon name="add" size="1.2rem" color="white" />
      </van-tabbar-item>
      <van-tabbar-item replace to="/msg">消息</van-tabbar-item>
      <van-tabbar-item replace to="/me">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { Toast } from 'vant'
export default {
  name: 'Home',
  setup(props) {
    const dataList = reactive({
      tabIndex: 0,
      active: 0,
    })
    const onChange = (index) => {}
    return {
      ...toRefs(dataList),
      onChange,
    }
  },
}
</script>

<style lang="less" scoped>
/deep/.van-tabbar {
  background-color: black;
  // background-color: rgba(0, 0, 0, 0.4);
  .van-tabbar-item--active {
    background-color: black;
  }
  .van-tabbar-item__text {
    font-size: 16px;
  }
}
</style>
