<template>
  <div class="edit">
    <!-- 子组件传来的@changeBack -->
    <Header title="编辑资料" :routerBack="true"></Header>
    <div class="edit-warp">
      <div class="ava-box">
        <div class="avatar">
          <!-- <span class="iconfont icon-xiangji"></span> -->
          <van-uploader :before-read="beforeRead" :after-read="afterRead" accept="image/*" :max-count="1">
            <van-image width="2rem" height="2rem" round fit="cover" position="center" :src="avatarUrl" />
          </van-uploader>
        </div>
        <p>点击更换头像</p>
      </div>
      <van-form @submit="onSubmit" @failed="onFailed" :show-error="true">
        <van-cell-group :border="false">
          <!-- 输入任意文本 -->
          <van-field v-model="formData.email" label="邮箱" name="email" size="large" placeholder="请输入邮箱号码" readonly :rules="[{ required: true }]" />
          <van-field v-model="formData.name" label="昵称" name="name" size="large" is-link placeholder="请输入昵称" autocomplete="off" :rules="[{ required: true }]" />
          <van-field v-model="formData.sex" label="性别" size="large" name="sex" is-link readonly @click="showPickerSex = true" />
          <van-field v-model="birthday" label="生日" size="large" name="birthday" is-link readonly @click="show = true" />
          <van-field v-model="formData.userId" label="抖音号" name="userId" size="large" readonly />
          <van-field v-model="formData.introduction" label="简介" name="introduction" autosize clear-trigger type="textarea" maxlength="50" show-word-limit size="large" autocomplete="off" placeholder="请输入简介" />
        </van-cell-group>
        <div class="code-btn">
          <van-button block color="#fe2c55" native-type="submit"> 提交 </van-button>
        </div>
      </van-form>
      <van-popup v-model:show="showPickerSex" position="bottom">
        <van-picker :columns="columns" @confirm="onConfirmSex" @cancel="showPickerSex = false" />
      </van-popup>
      <van-popup v-model:show="show" position="bottom">
        <van-datetime-picker v-model="currentDate" type="date" title="选择生日" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm" @cancel="show = false" />
      </van-popup>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import Header from '@/components/header/Header'
import { ref, reactive, toRefs, computed } from 'vue'
import moment from 'moment'
import { Toast } from 'vant'
import { useSessionStorage } from '@/hooks/sessionStorage'
import { update, uploadAvatar } from '@/api/user'
export default {
  components: {
    Header,
  },
  setup(props) {
    const router = new useRouter()
    const dataList = reactive({
      showPickerSex: false,
      columns: ['男', '女', '不展示'],
      show: false,
      minDate: new Date(1922, 0, 1),
      maxDate: new Date(),
      avatarUrl: useSessionStorage('user').avatar_url,
      formData: {
        email: useSessionStorage('user').email,
        name: useSessionStorage('user').name,
        introduction: useSessionStorage('user').introduction,
        sex: useSessionStorage('user').sex,
        birthday: useSessionStorage('user').birthday,
        userId: useSessionStorage('user').id,
      },
    })
    let birthday = computed(() => (dataList.formData.birthday ? moment(dataList.formData.birthday).format('YYYY-MM-DD') : ''))
    let currentDate = birthday.value ? moment(birthday.value, 'YYYY-MM-DD')._d : new Date()
    const onConfirmSex = (value) => {
      dataList.formData.sex = value
      dataList.showPickerSex = false
    }
    const onConfirm = (value) => {
      dataList.show = false
      dataList.formData.birthday = value
    }
    const beforeRead = (e) => {
      if (e.size > 10 * 1024 * 1024) {
        Toast.fail('上传的图片不能超过10M')
        return false
      }
      const type = e.type.split('/')[0]
      if (type == 'image') {
        return true
      } else {
        Toast.fail('请选择图片')
        return false
      }
    }
    const afterRead = (file) => {
      let formData = new FormData()
      formData.append('avatar', file.file)
      uploadAvatar(formData)
        .then((res) => {
          Toast.success('上传头像成功')
          window.location.reload()
        })
        .catch((err) => {
          Toast.fail('上传头像失败')
          console.log(err)
        })
    }
    const onSubmit = async (values) => {
      const result = await update(dataList.formData)
      useSessionStorage('user', result)
      Toast.success('修改成功')
      router.replace('/edit')
    }
    const onFailed = (errorInfo) => {
      console.log('failed', errorInfo)
    }
    return {
      ...toRefs(dataList),
      birthday,
      currentDate,
      onConfirmSex,
      onConfirm,
      beforeRead,
      afterRead,
      onSubmit,
      onFailed,
    }
  },
}
</script>

<style lang="less" scoped>
.edit {
  font-size: 16px;
}
.edit-warp {
  padding: 0 10px;
  box-sizing: border-box;
}
.ava-box {
  color: black;
  text-align: center;
  padding: 20px;
}
.code-btn button {
  margin: 20px 0;
}
</style>
