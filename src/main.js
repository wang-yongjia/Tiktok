import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import SocketIO from '@/utils/io'
import 'vant/lib/index.css'
import 'amfe-flexible/index.js'

//引入阿里图标库
import './assets/iconfont/iconfont.css'
import '@/assets/iconfont2/iconfont'
import 'swiper/swiper-bundle.min.css'
//播放器
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import { useSessionStorage } from '@/hooks/sessionStorage'

createApp(App)
  .use(store)
  .use(router)
  .use(VueVideoPlayer)
  .use(Vant)
  .use(SocketIO, {
    connection: 'http://localhost:3000',
  })
  .mount('#app')
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && to.path !== '/register' && to.path !== '/index') {
    const token = useSessionStorage('token')
    if (!token) router.replace('/login')
  }
  next()
})
