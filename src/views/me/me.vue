<template>
  <div class="me">
    <div class="me-top">
      <div class="menu-box">
        <van-icon name="wap-nav" size="0.8rem" color="white" @click="showPopup" />
      </div>
    </div>
    <div class="me-wrap">
      <div class="me-content">
        <div class="info">
          <van-image width="2.5rem" height="2.5rem" round fit="cover" position="center" :src="user.avatar_url" style="border: 2px solid white" @click="showAvatar(user.avatar_url)" />
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
        <van-tabs v-model:active="active" lazy-render sticky swipeable background="transparent" title-active-color="white" title-inactive-color="#cccccc" line-width="80" @change="changeTab">
          <van-tab title="作品">
            <Video :videoList="videoList" v-if="videoList.length > 0"></Video>
          </van-tab>
          <van-tab title="喜欢">
            <Video :videoList="videoLikeList" v-if="videoLikeList.length > 0"></Video>
          </van-tab>
          <van-tab title="动态">动态 </van-tab>
        </van-tabs>
      </div>
    </div>
    <van-popup v-model:show="show" position="right" :style="{ height: '100%', width: '60%' }">
      <van-cell-group :border="false">
        <van-cell title="修改密码" is-link size="large" @click=";(show = false), (showPassword = true)" />
        <van-cell title="编辑资料" is-link size="large" @click="$router.push('/edit')" />
      </van-cell-group>
      <van-button block color="#fe2c55" @click="logout"> 退出登录 </van-button>
    </van-popup>
    <!-- 修改密码弹出层 -->
    <van-popup v-model:show="showPassword" position="bottom" :style="{ height: '50%', width: '100%' }">
      <div class="sign-content">
        <van-form @submit="onSubmit" @failed="onFailed" :show-error="true">
          <van-cell-group :border="false">
            <van-field class="sign-box" label="旧密码" size="large" v-model="password.oldPass" type="password" name="oldPassword" placeholder="请输入旧密码" autocomplete="off" :rules="[{ required: true }]" />
            <van-field class="sign-box" label="新密码" size="large" v-model="password.newPass" type="password" name="newPassword" placeholder="请输入新密码" autocomplete="off" :rules="[{ required: true }]" />
          </van-cell-group>
          <van-button block color="#fe2c55" native-type="submit"> 确认 </van-button>
        </van-form>
      </div>
    </van-popup>
  </div>
  <tab-bar></tab-bar>
</template>
<script>
import { onActivated, onDeactivated, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { ImagePreview } from 'vant'
import TabBar from '@/components/TabBar'
import Video from '@/components/Video'
import { useSessionStorage } from '@/hooks/sessionStorage'
import { updatePassword } from '@/api/user'
import { getVideoByUserId, getVideoLikeByUserId } from '@/api/video'
import { Toast } from 'vant'
export default {
  components: {
    TabBar,
    Video,
  },
  setup(props) {
    const router = new useRouter()
    const dataList = reactive({
      active: 0,
      user: useSessionStorage('user'),
      show: false,
      showPassword: false,
      videoList: [],
      videoLikeList: [],
      password: {
        email: useSessionStorage('user').email,
        oldPass: '',
        newPass: '',
      },
    })
    // 获取我发布的作品，后续需要增加获取喜欢、动态
    getVideoByUserId(dataList.user.id).then((res) => {
      dataList.videoList = res
    })
    getVideoLikeByUserId(dataList.user.id).then((res) => {
      dataList.videoLikeList = res.videoLikeList
    })
    const showAvatar = (avatarUrl) => {
      ImagePreview({
        images: [avatarUrl],
      })
    }
    const changeTab = (index) => {
      dataList.active = index
    }
    // 侧边栏
    const showPopup = () => {
      dataList.show = true
    }
    // 修改密码
    const onSubmit = () => {
      updatePassword(dataList.password)
        .then((res) => {
          Toast(res.message)
          if (res.state) {
            dataList.password.oldPass = ''
            dataList.password.newPass = ''
            dataList.showPassword = false
          }
        })
        .catch((err) => {
          console.log(err)
          Toast('修改密码失败')
        })
    }
    const onFailed = (errorInfo) => {
      console.log('failed', errorInfo)
    }
    const logout = () => {
      window.sessionStorage.clear()
      Toast.success('退出登陆成功')
      window.location.reload()
    }
    onActivated(() => {
      dataList.show = false
    })
    return {
      ...toRefs(dataList),
      showAvatar,
      changeTab,
      showPopup,
      onSubmit,
      onFailed,
      logout,
    }
  },
}
</script>

<style lang="less" scoped>
/deep/.van-button {
  position: absolute;
  bottom: 0;
}
/deep/.van-cell-group {
  margin-top: 20px;
}
/deep/.van-tabs__line {
  background-color: #ffdf0e;
}
.sign-box {
  display: flex;
  height: 50px;
  align-items: center;
  background: #f9f9f9;
  margin-top: 12px;
}
.me {
  position: relative;
  height: 100%;
  background-color: #101821;
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
.me-wrap {
  position: absolute;
  top: 140px;
  width: 100%;
  background-color: #101821;
  color: #ffffff;
}
.me-content {
  padding: 0 20px;
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      height: 40px;
      padding: 0 24px;
      background-color: #393842;
      border: none;
      color: white;
    }
  }
  .des {
    padding: 20px 0;
    line-height: 30px;
    h2 {
      font-size: 24px;
      font-weight: bold;
    }
    span {
      padding: 10px 0 15px 0;
    }
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
    span {
      font-size: 14px;
      margin-right: 15px;
      color: #cccccc;
    }
    a {
      margin-right: 5px;
      color: #cccccc;
    }
  }
}
.me-tab {
  // height: 300px;
  height: 100%;
}
</style>
