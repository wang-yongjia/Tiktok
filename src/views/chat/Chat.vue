<template>
  <div class="chat">
    <Header :title="toUserInfo.name" :routerBack="true"></Header>
    <div class="msg" ref="msg">
      <div class="message" v-for="(item, index) in messageList" :key="index" v-show="messageList.length > 0">
        <div class="message-my-info" v-if="item.user_id === userId || item.userId === userId">
          <div class="message-avatar">
            <van-image width="1rem" height="1rem" fit="cover" round position="center" :src="userInfo.avatar_url" />
          </div>
          <div class="message-content">
            <div class="content">{{ item.message }}</div>
            <div class="time">{{ createDate(item.createAt) }}</div>
          </div>
        </div>
        <div class="message-info" v-else>
          <div class="message-avatar">
            <van-image width="1rem" height="1rem" fit="cover" round position="center" :src="toUserInfo.avatar_url" />
          </div>
          <div class="message-content">
            <div class="content">{{ item.message }}</div>
            <div class="time">{{ createDate(item.createAt) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="message-input">
      <van-field v-model="message" center clearable placeholder="请输入...">
        <template #button>
          <van-icon name="chat" size="1rem" @click="onSend" />
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { computed, inject, nextTick, reactive, ref, toRefs } from 'vue'
import moment from 'moment'
import Header from '@/components/header/Header'
import { useSessionStorage } from '@/hooks/sessionStorage'
import { getUserInfoById, getChatList, createChat } from '@/api/user'
import { Toast } from 'vant'
export default {
  components: {
    Header,
  },
  setup(props) {
    const route = new useRoute()
    const socket = inject('socket')
    const msg = ref(null)
    const chat = ref(null)
    const dataList = reactive({
      message: '',
      userId: useSessionStorage('user').id,
      toUserId: parseInt(route.query.toUserId),
      userInfo: useSessionStorage('user'),
      toUserInfo: {},
      messageList: [],
    })
    let createDate = computed(() => {
      return function (createDate) {
        return moment(createDate).format('YYYY-MM-DD HH:mm:ss')
      }
    })
    // 加入聊天室
    const join = () => {
      socket.emit('join', { userId: dataList.userId, toUserId: dataList.toUserId })
    }
    // 发送信息
    const onSend = async () => {
      if (dataList.message.trim().length === 0) {
        Toast('请输入内容')
        return
      }
      const data = {
        userId: dataList.userId,
        user2Id: dataList.toUserId,
        message: dataList.message,
      }
      dataList.messageList.push(data)
      dataList.message = ''
      socket.emit('message', data)
      nextTick(() => {
        window.scroll(0, msg.value.scrollHeight)
      })
      await createChat(data)
    }
    // 接收信息
    const getMsg = () => {
      socket.on('sendMsg', (res) => {
        // 单接收者为自己时才添加上去
        if (res.user2Id === dataList.userId) {
          dataList.messageList.push(res)
          nextTick(() => {
            window.scroll(0, msg.value.scrollHeight)
          })
        }
      })
    }
    // 初始化函数
    const init = () => {
      join()
      getMsg()
      // 获取消息列表
      getChatList({ userId: dataList.userId, user2Id: dataList.toUserId }).then((res) => {
        dataList.messageList = res.messageList
        nextTick(() => {
          window.scroll(0, msg.value.scrollHeight)
        })
      })
      // 获取toUser用户信息
      getUserInfoById(dataList.toUserId).then((res) => {
        dataList.toUserInfo = res
      })
    }
    init()
    return {
      msg,
      ...toRefs(dataList),
      createDate,
      onSend,
    }
  },
}
</script>

<style lang="less" scoped>
.chat {
  padding-bottom: var(--van-tabbar-height);
}
.message-info,
.message-my-info {
  display: flex;
  margin-bottom: 10px;
  .message-avatar {
    width: 20%;
    text-align: center;
  }
  .message-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 60%;
    font-size: 16px;
    .content {
      border-radius: 10px 10px 10px 0;
      padding: 10px;
      color: black;
      line-height: 25px;
      background-color: #eeeeee;
    }
    .time {
      font-size: 14px;
      color: #cccccc;
      margin-top: 5px;
    }
  }
}
// 我发送的信息
.message-my-info {
  flex-direction: row-reverse;
  .message-content {
    align-items: flex-end;
    .content {
      border-radius: 10px 10px 0px 10px;
      color: white;
      background-color: #537efd;
    }
  }
}
// 输入框
.message-input {
  position: fixed;
  left: 50%;
  bottom: 0;
  width: 95%;
  transform: translateX(-50%);
}
/deep/.van-field {
  background-color: #eeeeee;
  border-radius: 15px;
}
</style>
