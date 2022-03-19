<template>
  <div class="user-header">
    <van-nav-bar :border="false" placeholder fixed :title="title" :right-text="rightText" @click-right="onClickRight"> </van-nav-bar>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    rightText: {
      type: String,
      required: false,
    },
  },
  setup(props, { emit }) {
    const onClickRight = () => {
      emit('onClickRight')
    }
    return {
      onClickRight,
    }
  },
}
</script>

<style lang="less" scoped>
/deep/.van-nav-bar__content {
  line-height: 50px;
  background-color: #101821;
  .van-nav-bar__title {
    font-size: 18px;
    color: white;
  }
  .van-nav-bar__text {
    font-size: 18px;
    color: white;
  }
}
</style>
