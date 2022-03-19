<template>
  <div class="tab-bar">
    <van-tabbar v-model="active" route fixed active-color="white" inactive-color="#cccccc" @change="onChange">
      <van-tabbar-item replace to="/index">首页</van-tabbar-item>
      <van-tabbar-item replace to="/friend">朋友</van-tabbar-item>
      <van-tabbar-item replace>
        <van-uploader accept="video/*" :max-count="1" capture="camera" :before-read="beforeRead" :after-read="afterRead">
          <van-icon name="add" size="1.2rem" color="white" />
        </van-uploader>
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
    const beforeRead = (e) => {
      if (e.size > 100 * 1024 * 1024) {
        Toast.fail('上传的视频不能超过100M')
        return false
      }
      const type = e.type.split('/')[0]
      if (type == 'video') {
        return true
      } else {
        Toast.fail('请选择视频')
        return false
      }
    }
    const afterRead = (file) => {
      let formData = new FormData()
      formData.append('video', file.file)
    }
    return {
      ...toRefs(dataList),
      onChange,
      beforeRead,
      afterRead,
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
