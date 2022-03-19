<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.path" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.path" />
    </router-view>
    <!-- <router-view></router-view> -->
  </div>
</template>
<script>
export default {
  setup(props) {
    const arr = ['Home']

    return {
      arr,
    }
  },
}
</script>
<style lang="less">
#app {
  height: 100%;
  // background-color: #101821;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
