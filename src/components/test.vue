<template>
  <div v-for="(item, index) in list" :ref="setItemRef" :key="index">{{ item.name }}</div>
</template>

<script>
import { onBeforeUpdate, onUpdated, nextTick } from 'vue'
export default {
  setup(props) {
    console.log(1)
    const list = [{ name: 1 }, { name: 2 }, { name: 3 }]
    let itemRefs = []
    const setItemRef = (el) => {
      if (el) {
        itemRefs.push(el)
      }
    }
    nextTick(() => {
      console.dir(itemRefs)
    })
    return {
      list,
      setItemRef,
    }
  },
}
</script>

<style></style>
