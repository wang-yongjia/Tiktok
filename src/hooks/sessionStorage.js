import { ref, watch } from 'vue'
export function useSessionStorage(key, value) {
  const data = ref(value)

  if (value) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } else {
    try {
      data.value = JSON.parse(window.sessionStorage.getItem(key))
    } catch (error) {
      // JSON.parse报错，表明改值是字符串，则直接返回即可
      data.value = window.sessionStorage.getItem(key)
    }
  }

  watch(data, () => {
    window.sessionStorage.setItem(key, JSON.stringify(data.value))
  })

  return data.value
}
