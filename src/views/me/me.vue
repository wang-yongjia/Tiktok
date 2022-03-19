<template>
  <div class="me">
    <div class="me-top">
      <div class="menu-box" @click="showPopup">
        <div class="menu-icon"></div>
        <!-- <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xihuan"></use>
        </svg> -->
      </div>
    </div>
    <div class="me-wrap">
      <div class="me-content">
        <div class="info">
          <img :src="user.avatar_url" />
          <router-link to="/edit"><button class="btn">编辑资料</button></router-link>
          <button class="btn">+朋友</button>
        </div>
        <div class="des">
          <h2>{{ user.name }}</h2>
          <span>抖音号：{{ user.id }}</span>
          <p>{{ user.introduction }}</p>
        </div>
        <div class="user-tag">
          <span>18岁</span>
          <span>中国-北京</span>
          <span>+添加学校等标签</span>
        </div>
        <div class="user-tag2">
          <span><a href="#">20w</a>获赞</span>
          <span><a href="#">30w</a>关注</span>
          <span><a href="#">40w</a>粉丝</span>
        </div>
      </div>

      <div class="me-tab">
        <div class="me-navbar">
          <div class="item" @click="changeTab(0)" :class="indexTab == 0 ? 'active' : ''">作品3</div>
          <div class="item" @click="changeTab(1)" :class="indexTab == 1 ? 'active' : ''">动态0</div>
          <div class="item" @click="changeTab(2)" :class="indexTab == 2 ? 'active' : ''">喜欢0</div>
        </div>
        <div class="tab-wrap">
          <div class="tab-con" v-show="indexTab == 0">
            <div class="tab-img">
              <img src="../../assets/img/0.jpg" alt="" />
              <img src="../../assets/img/1.jpg" alt="" />
              <img src="../../assets/img/2.jpg" alt="" />
              <img src="../../assets/img/0.jpg" alt="" />
              <img src="../../assets/img/1.jpg" alt="" />
              <img src="../../assets/img/2.jpg" alt="" />
              <img src="../../assets/img/2.jpg" alt="" />
              <img src="../../assets/img/0.jpg" alt="" />
              <img src="../../assets/img/1.jpg" alt="" />
              <img src="../../assets/img/2.jpg" alt="" />
            </div>
          </div>

          <div class="tab-con" v-show="indexTab == 1">动态</div>
          <div class="tab-con" v-show="indexTab == 2">喜欢</div>
        </div>
      </div>
    </div>
    <van-popup v-model:show="show" position="right" :style="{ height: '100%', width: '60%' }">
      <van-cell-group :border="false">
        <van-cell title="修改密码" is-link size="large" />
        <van-cell title="编辑资料" is-link size="large" @click="$router.push('/edit')" />
      </van-cell-group>
      <van-button block color="#fe2c55" @click="logout"> 退出登录 </van-button>
    </van-popup>
  </div>
  <tab-bar></tab-bar>
</template>
<script>
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '@/components/TabBar'
import { useSessionStorage } from '@/hooks/sessionStorage'
import { Toast } from 'vant'
export default {
  components: {
    TabBar,
  },
  setup(props) {
    const router = new useRouter()
    const dataList = reactive({
      indexTab: 0,
      user: useSessionStorage('user'),
      show: false,
    })
    dataList.user.avatar_url = dataList.user.avatar_url ? dataList.user.avatar_url : require('../../assets/img/xxx.jpeg')
    const changeTab = (index) => {
      dataList.indexTab = index
    }
    const showPopup = () => {
      dataList.show = true
    }
    const logout = () => {
      window.sessionStorage.clear()
      Toast.success('退出登陆成功')
      router.replace('/index')
    }
    return {
      ...toRefs(dataList),
      changeTab,
      showPopup,
      logout,
    }
  },
}
</script>

<style lang="less" scoped>
.icon {
  height: 60px;
  width: 60px;
  fill: red;
}
/deep/.van-popup {
  // background-color: #101821;
}
/deep/.van-button {
  position: absolute;
  bottom: 0;
}
/deep/.van-cell-group {
  margin-top: 20px;
}
.me {
  position: relative;
  font-size: 16px;
}
.me-top {
  height: 160px;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  background-image: url('../../assets/img/bq.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.menu-box {
  // width: 30px;
  // height: 30px;
  // border-radius: 50%;
  // background: rgba(0, 0, 0, 0.3);
  // display: flex;
  // align-items: center;
  // justify-content: center;
}
.menu-icon {
  background: white;
  border-top: 2px solid white;
  border-bottom: 2px solid white;
  background-clip: content-box;
  width: 20px;
  height: 15px;
  padding: 5px 0;
}
.me-wrap {
  position: absolute;
  top: 140px;
  width: 100%;
  background-color: #101821;
  color: #ffffff;
}
.me-content {
  padding: 0 20px;
}
.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.info img {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  margin-right: 20px;
}
.info button {
  height: 40px;
  padding: 0 24px;
  background-color: #393842;
  border: none;
  color: white;
}

.des {
  padding: 20px 0;
}
.des h2 {
  font-size: 24px;
  font-weight: bold;
}
.des span {
  padding: 10px 0 15px 0;
  /* display: block; */
}
.des p {
  line-height: 24px;
}
.user-tag span {
  font-size: 14px;
  color: #cccccc;
  margin-right: 5px;
  background: rgba(0, 0, 0, 0.6);
  padding: 5px 8px;
}
.user-tag2 {
  padding: 20px 0;
}
.user-tag2 span {
  font-size: 14px;
  margin-right: 15px;
  color: #cccccc;
}
.user-tag2 a {
  /* font-size: 18px; */
  margin-right: 5px;
  color: #cccccc;
}
.me-tab {
  height: 300px;
}
.me-navbar {
  display: flex;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
}
.me-navbar .item {
  padding: 10px 25px;
  color: #cccccc;
}
.me-navbar .active {
  border-bottom: 2px solid #ffdf0e;
  color: white;
}

.tab-img img {
  width: 33.3%;
  height: 150px;
}
</style>
