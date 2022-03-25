<template>
  <div class="comment">
    <van-list :finished="finished" finished-text="没有更多了">
      <div class="comment-title">{{ commentNum }}条评论</div>
      <div class="comment-info" v-for="(item, index) in commentList" :key="item.id">
        <div class="comment-avatar">
          <van-image width="1rem" height="1rem" fit="cover" round position="center" :src="item.user.avatar_url" />
        </div>
        <div class="comment-content">
          <div class="name">{{ item.user.name }}</div>
          <div class="content" @click="replyComment(item)">{{ item.content }}</div>
          <div class="time">{{ commentDate(item.createAt) }}</div>
          <div class="more" @click="showReply(index)" v-if="item.replyComment.length > 0 && !item.showReply">展开更多回复<van-icon name="arrow-down" /></div>
          <transition name="up">
            <div v-show="item.replyComment.length > 0 && item.showReply" style="margin-top: 5px">
              <div class="more-reply" v-for="(item2, index2) in item.replyComment" :key="item2.id">
                <div class="comment-avatar">
                  <van-image width="0.8rem" height="0.8rem" fit="cover" round position="center" :src="item2.user.avatar_url" />
                </div>
                <div class="comment-content">
                  <div class="name">{{ item2.user.name }}</div>
                  <div class="content">{{ item2.content }}</div>
                  <div class="time">{{ commentDate(item2.createAt) }}</div>
                </div>
                <div class="comment-like">
                  <van-icon name="like" @click="commentLike(item2, item2.isLike, index, index2)" :class="{ active: item2.isLike }" />
                  <p>{{ item2.comment_like }}</p>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div class="comment-like" @click="commentLike(item, item.isLike, index)">
          <van-icon name="like" :class="{ active: item.isLike }" />
          <p>{{ item.comment_like }}</p>
        </div>
      </div>
      <div class="comment-input">
        <van-search v-model="comment" shape="round" clearable :placeholder="placeholder" @search="onSend" show-action left-icon="" ref="replyInput">
          <template #action>
            <div @click="onSend">发送</div>
          </template>
        </van-search>
      </div>
    </van-list>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, toRefs } from 'vue'
import { Toast } from 'vant'
import moment from 'moment'
import { getCommentByVideoId, createComment, createCommentLike, commentUnlike } from '@/api/comment'
import { useSessionStorage } from '@/hooks/sessionStorage'
export default {
  props: {
    videoInfo: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const replyInput = ref(null)
    const dataList = reactive({
      finished: true,
      comment: '',
      commentNum: props.videoInfo.comment,
      placeholder: '留下你的精彩评论',
      commentList: [],
      commentForm: {
        content: '',
        videoId: 0,
        userId: 0,
      },
    })
    let commentDate = computed(() => {
      return function (commentDate) {
        return moment(commentDate).format('YYYY-MM-DD HH:mm:ss')
      }
    })
    const init = () => {
      // 获取视频评论信息
      getCommentByVideoId(props.videoInfo.id).then((res) => {
        dataList.commentList = res.commentList
      })
    }
    const onSend = () => {
      dataList.commentForm.videoId = props.videoInfo.id
      dataList.commentForm.userId = useSessionStorage('user').id
      dataList.commentForm.content = dataList.comment
      console.log(dataList.commentForm)
      createComment(dataList.commentForm).then((res) => {
        dataList.comment = ''
        Toast('评论成功')
        dataList.commentNum++
        init()
      })
    }
    const showReply = (index) => {
      dataList.commentList[index].showReply = true
    }
    const replyComment = (comment) => {
      dataList.placeholder = `@：${comment.user.name}`
      dataList.commentForm.commentId = comment.id
      replyInput.value.focus()
    }
    const commentLike = async (comment, isLike, index, index2) => {
      console.log(comment, isLike, index, index2)
      const userId = comment.user.id
      const commentId = comment.id
      if (isLike) {
        // 取消点赞
        const result = await commentUnlike({ userId, commentId })
        if (index2) {
          dataList.commentList[index].replyComment[index2].comment_like--
        } else {
          dataList.commentList[index].comment_like--
        }
      } else {
        // 点赞
        const result = await createCommentLike({ userId, commentId })
        if (index2) {
          dataList.commentList[index].replyComment[index2].comment_like++
        } else {
          dataList.commentList[index].comment_like++
        }
      }
      if (index2) {
        dataList.commentList[index].replyComment[index2].isLike = !dataList.commentList[index].replyComment[index2].isLike
      } else {
        dataList.commentList[index].isLike = !dataList.commentList[index].isLike
      }
    }
    init()
    return {
      replyInput,
      commentDate,
      ...toRefs(dataList),
      onSend,
      showReply,
      replyComment,
      commentLike,
    }
  },
}
</script>

<style lang="less" scoped>
/deep/.van-list {
  margin-bottom: var(--van-tabbar-height);
}
// 点赞样式
.active {
  color: #fe2c55;
}
// 评论标题
.comment-title {
  width: 100%;
  font-size: 20px;
  line-height: 40px;
  text-align: center;
  margin-bottom: 20px;
}
.comment-info {
  display: flex;
  margin-bottom: 10px;
  .comment-avatar {
    flex: 3;
    text-align: center;
  }
  .comment-content {
    flex: 12;
    font-size: 16px;
    .name {
      font-size: 15px;
      margin-bottom: 5px;
    }
    .content {
      color: black;
      line-height: 25px;
    }
    .time {
      font-size: 14px;
      color: #cccccc;
      margin-top: 5px;
    }
    .more {
      text-align: center;
      font-size: 14px;
      color: #666666;
    }
    .more-reply {
      display: flex;
      .comment-like {
        font-size: 24px;
      }
    }
  }
  .comment-like {
    flex: 2;
    text-align: center;
    color: #aaaaaa;
    p {
      font-size: 14px;
    }
  }
}
.comment-input {
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: #dddddd 1px solid;
}
// 展开回复
// .up-enter-active,
// .up-leave-active {
//   transition: all 1s;
// }
// .up-enter-from,
// .up-leave-to {
//   opacity: 0;
//   transform: translateY(-20%);
// }
.up-enter-active {
  transition: all 1s;
}
.up-enter-from {
  opacity: 0;
  transform: translateY(-20%);
}
</style>
