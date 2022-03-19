<template>
  <div class="right-bar">
    <div class="rightbar-item">
      <van-image round width="1.8rem" height="1.8rem" src="https://img.yzcdn.cn/vant/cat.jpeg" />
      <van-icon name="add" size="0.6rem" />
    </div>
    <div class="item-icon">
      <van-icon name="like" @touchstart.stop="changeLike" :class="{ active: isLike, deactive: !isLike }" size="1.1rem" />
      <p>1w</p>
    </div>
    <div class="item-icon" @touchstart.stop="showCom">
      <van-icon name="chat-o" size="1.1rem" color="white" />
      <p>1w</p>
    </div>
    <div class="item-icon">
      <van-icon name="down" size="1.1rem" color="white" />
    </div>
    <div class="rightbar-item">
      <div class="right-music">
        <img src="../../assets/img/xxx.jpeg" />
      </div>
    </div>
    <div class="like-box" v-if="showLike">
      <div class="like"></div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
  // VideoList.vue传过来的
  props: ['showComment'],
  setup(props, { emit }) {
    const dataList = reactive({
      showLike: false,
      isLike: false,
    })
    const showCom = () => {
      emit('changeCom', props.showComment)
    }
    const changeLike = () => {
      dataList.isLike = !dataList.isLike
      if (dataList.isLike) {
        emit('changeLike')
      }
    }
    return {
      ...toRefs(dataList),
      showCom,
      changeLike,
    }
  },
}
</script>

<style lang="less" scoped>
.like-box {
  width: 200px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .like {
    width: 100%;
    height: 100%;
    background: url(../../assets/like.png) no-repeat;
    background-position: left;
    background-size: cover;
    animation: heart-animated 0.5s 1 steps(28);
    animation-fill-mode: forwards; //动画完成后，保持最后一个属性值
  }
  @keyframes heart-animated {
    0% {
      background-position: left;
    }
    100% {
      background-position: right;
    }
  }
}
.deactive {
  color: white;
}
.active {
  color: #fe2c55;
}
.rightbar-item {
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-bottom: 15px;
}
/deep/.van-icon-add {
  position: absolute;
  top: 1.5rem;
  color: red;
  font-weight: 900;
}
.item-icon {
  height: 65px;
  text-align: center;
  p {
    color: #ffffff;
    font-size: 14px;
  }
}
.right-music {
  height: 54px;
  width: 54px;
  background: #2e2e2e;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: round 6s 0s linear infinite;
  img {
    height: 30px;
    width: 30px;
    border-radius: 50%;
  }
  @keyframes round {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
