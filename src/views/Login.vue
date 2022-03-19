<template>
  <div class="sign">
    <Header rightText="注册" :routerBack="true" @onClickRight="onClickRight"></Header>
    <div class="sign-content">
      <div class="des">
        <h2>邮箱密码登录</h2>
      </div>
      <van-form @submit="onSubmit" @failed="onFailed" :show-error="true">
        <van-field class="sign-box" v-model="user.email" name="email" placeholder="请输入邮箱号码" autofocus :rules="[{ required: true }]" />
        <van-field class="sign-box" v-model="user.password" type="password" name="password" placeholder="请输入密码" autocomplete="off" :rules="[{ required: true }]" />
        <div class="not-sign">
          <p>登录即表明同意<a href="#">抖音协议</a>和<a href="#">隐私政策</a></p>
        </div>
        <div class="code-btn">
          <van-button block color="#fe2c55" native-type="submit"> 提交 </van-button>
        </div>
        <div class="other">
          <span>忘记了？<a href="#">找回密码</a></span>
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
import { login } from '@/api/user'
import { useSessionStorage } from '@/hooks/sessionStorage'
export default {
  name: 'Login',
  components: {
    Header,
  },
  setup(props) {
    const router = new useRouter()
    const dataList = reactive({
      user: {
        email: '',
        password: '',
      },
    })
    const onSubmit = (values) => {
      console.log('submit', values)
      // 邮箱验证
      const regtel = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/
      if (!regtel.test(values.email)) {
        Toast.fail('邮箱格式错误，请重新输入')
        return
      }
      login(dataList.user)
        .then((res) => {
          console.log(res)
          Toast.success('登录成功')
          useSessionStorage('token', res.token)
          useSessionStorage('user', res.user)
          router.push('/me')
        })
        .catch((err) => {
          Toast.fail(err.message)
          console.log(err)
        })
    }
    const onFailed = (errorInfo) => {
      console.log('failed', errorInfo)
    }
    const onClickRight = () => {
      console.log('点击了帮助')
      router.push('/register')
    }
    return {
      ...toRefs(dataList),
      onSubmit,
      onFailed,
      onClickRight,
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
.other {
  display: flex;
  justify-content: space-between;
}
.other a {
  color: #628088;
}
</style>
