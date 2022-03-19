<template>
  <div class="header-container">
    <van-nav-bar :left-arrow="isLeft" :border="false" placeholder fixed :title="title" :right-text="rightText" @click-left="onClickLeft" @click-right="onClickRight"> </van-nav-bar>
    <!-- 开启fixed后占据位置 -->
    <!-- <div style="height:var(--van-nav-bar-height)"></div> -->
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
export default {
  name: 'Header',
  props: {
    isLeft: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '',
    },
    rightText: {
      type: String,
      default: '',
    },
    routerBack: {
      type: Boolean,
    },
  },
  setup(props, context) {
    const router = useRouter()
    const onClickLeft = () => {
      if (props.routerBack) {
        router.back()
      } else {
        context.emit('onClickLeft')
      }
    }
    const onClickRight = () => {
      context.emit('onClickRight')
    }
    return {
      onClickLeft,
      onClickRight,
    }
  },
}
</script>

<style lang="less" scoped>
// 设置父元素高度，防止高度塌陷
.header-container {
  // height: var(--van-nav-bar-height);
}
/deep/.van-nav-bar__content {
  margin-top: 20px;
  line-height: 50px;
}
/deep/.van-icon-arrow-left {
  font-size: 20px;
  color: black;
}
/deep/.van-nav-bar__text {
  font-size: 18px;
  color: black;
}
</style>
