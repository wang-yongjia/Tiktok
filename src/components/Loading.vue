<template>
  <div class="loading"></div>
</template>

<script>
import { Toast } from 'vant'
import { watch } from 'vue'
import store from '@/store/index'

export default {
  name: 'Header',
  setup() {
    // 监听vuex的isLoading状态变化
    watch(
      () => store.state.isLoading,
      (newValue) => {
        if (newValue) {
          Toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0, // 展示时长(ms)，值为 0 时，toast 不会消失
          })
        } else {
          Toast.clear()
        }
      }
    )
  },
}
</script>

<style lang="less" scoped></style>
