<template>
  <div class="release">
    <Header title="发布" @onClickLeft="$router.back()"></Header>
    <van-field v-model="release" name="introduction" :border="false" autosize clear-trigger type="textarea" maxlength="100" show-word-limit size="large" autocomplete="off" placeholder="添加作品描述..." />
    <div class="release-container">
      <van-uploader accept="video/*" :max-count="1" capture="camera" preview-size="200" v-model="videoList" :before-read="beforeRead" :after-read="afterRead" @delete="deleteVideo" @click-preview="playVideo">
        <template #preview-cover>
          <video style="width: 200px; height: 200px; object-fit: cover" :src="videoUrl" v-if="videoUrl"></video>
        </template>
      </van-uploader>
    </div>
    <div class="release-btn">
      <van-button block color="#fe2c55" @click="submit"> 发布 </van-button>
    </div>
    <van-dialog theme="default" v-model:show="showvideoplay" :show-cancel-button="false" :show-confirm-button="false" :closeOnClickOverlay="true" style="border-radius: 0">
      <!-- 视频预览  -->
      <video controls loop autoplay preload="auto" style="width: 100%; object-fit: contain" :src="videoUrl" v-if="videoUrl && showvideoplay"></video>
    </van-dialog>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { Toast } from 'vant'
import Header from '@/components/header/Header'
import { uploadVideo } from '@/api/video'
import { useRouter } from 'vue-router'
export default {
  components: {
    Header,
  },
  setup(props) {
    const router = new useRouter()
    const dataList = reactive({
      release: '',
      formData: new FormData(),
      videoList: [],
      videoUrl: '',
      showvideoplay: false,
    })
    const beforeRead = (e) => {
      if (e.size > 100 * 1024 * 1024) {
        Toast.fail('上传的视频不能超过100M')
        return false
      }
      const type = e.type.split('/')[0]
      if (type == 'video') {
        return true
      } else {
        Toast('请选择视频文件')
        return false
      }
    }
    const afterRead = (file) => {
      dataList.formData.append('video', file.file)
      dataList.videoUrl = dataList.videoList[0].content
    }
    // 删除视频
    const deleteVideo = (file) => {
      dataList.formData.delete('video')
    }
    // 播放视频
    const playVideo = () => {
      dataList.showvideoplay = true
    }
    const submit = () => {
      if (!dataList.release) {
        Toast('请添加作品描述')
        return
      } else if (dataList.formData.getAll('video').length === 0) {
        Toast('请选择视频上传')
        return
      }
      dataList.formData.append('desc', dataList.release)
      uploadVideo(dataList.formData).then((res) => {
        Toast('发布视频成功')
        router.replace('/me')
      })
    }
    return {
      ...toRefs(dataList),
      beforeRead,
      afterRead,
      deleteVideo,
      playVideo,
      submit,
    }
  },
}
</script>

<style lang="less" scoped>
.release {
  padding: 0 20px;
}
.release-container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.release-btn {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
}
/deep/.van-cell {
  padding: 10px 0;
}
// 视频预览白色背景去除
/deep/.van-popup {
  background-color: transparent;
}
</style>
