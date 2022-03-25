<template>
  <div class="sign">
    <Header rightText="登录" :routerBack="true" @onClickRight="onClickRight"></Header>
    <div class="sign-content">
      <div class="des">
        <h2>注册</h2>
      </div>
      <!-- @blur="loginAction" -->
      <van-form @submit="onSubmit" @failed="onFailed" :show-error="true">
        <van-field class="sign-box" v-model="user.name" name="name" placeholder="请输入昵称" center clearable autofocus autocomplete="off" :rules="[{ required: true }]" />
        <van-field class="sign-box" v-model="user.email" name="email" placeholder="请输入邮箱号码" center clearable :rules="[{ required: true }]" />
        <van-field class="sign-box" v-model="user.password" type="password" name="password" center clearable placeholder="请输入密码" autocomplete="off" :rules="[{ required: true }]" />
        <van-field class="sign-box" v-model="emailCode" center clearable placeholder="请输入邮箱验证码" autocomplete="off" :rules="[{ required: true }]">
          <template #button>
            <van-button size="small" color="#fe2c55" @click="onSend" v-if="showBtn">发送验证码</van-button>
            <van-count-down :time="time" format="ss" @finish="finish" v-else />
          </template>
        </van-field>
        <div class="not-sign">
          <p>注册即表明同意<a href="#">抖音协议</a>和<a href="#">隐私政策</a></p>
        </div>
        <div class="code-btn">
          <van-button block color="#fe2c55" native-type="submit"> 提交 </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import Header from '@/components/header/Header'
import { register, sendEmailCode } from '@/api/user'
export default {
  name: 'Register',
  components: {
    Header,
  },
  setup(props) {
    const router = new useRouter()
    const dataList = reactive({
      user: {
        name: '',
        email: '',
        password: '',
      },
      emailCode: '',
      time: 10 * 1000,
      showBtn: true,
      returnEmailCode: '',
    })
    const onClickRight = () => {
      router.push('/login')
    }
    // 发送验证码
    const onSend = () => {
      const regtel = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/
      if (!regtel.test(dataList.user.email)) {
        Toast('邮箱格式错误，请重新输入')
        return
      }
      sendEmailCode(dataList.user.email)
        .then((res) => {
          dataList.returnEmailCode = res.emailCode
          dataList.showBtn = false
        })
        .catch((err) => {
          console.log(err)
          Toast('发送验证码失败')
        })
    }
    // 验证码倒计时结束
    const finish = () => {
      console.log('验证码结束')
      dataList.showBtn = true
    }
    const onSubmit = (values) => {
      console.log('submit', values)
      // 邮箱验证
      const regtel = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/
      if (!regtel.test(values.email)) {
        Toast('邮箱格式错误，请重新输入')
        return
      } else if (dataList.returnEmailCode !== dataList.emailCode) {
        Toast('邮箱验证码错误，请重新输入')
        return
      }
      register(dataList.user)
        .then((res) => {
          console.log(res)
          Toast('注册成功')
          router.push('/login')
        })
        .catch((err) => {
          Toast.fail(err.message)
          console.log(err)
        })
    }
    const onFailed = (errorInfo) => {
      console.log('failed', errorInfo)
    }
    return {
      ...toRefs(dataList),
      onClickRight,
      onSend,
      finish,
      onSubmit,
      onFailed,
    }
  },
}
</script>

<style lang="less" scoped>
.sign {
  font-size: 16px;
  padding: 30px;
}
.icon {
  font-size: 30px;
}
.sign-content {
  padding: 40px 10px;
}
.des {
  margin-bottom: 30px;
  color: #628088;
  padding: 0 5px;
  h2 {
    font-size: 24px;
    font-weight: bold;
    color: black;
  }
}
.sign-box {
  display: flex;
  height: 50px;
  align-items: center;
  background: #f9f9f9;
  margin-top: 12px;
}
.not-sign p {
  color: #cccccc;
  font-size: 14px;
  margin-top: 10px;
  a {
    color: #628088;
    padding: 0 5px;
  }
}
.code-btn button {
  margin: 20px 0;
}
</style>
