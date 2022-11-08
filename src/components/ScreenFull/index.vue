<template>
  <div>
    <svg-icon icon-class="fullscreen" style="color:#fff;width:20px;height:20px" @click="changeScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  name: 'ScreenFull',

  data() {
    return {

    }
  },

  mounted() {

  },

  methods: {
    changeScreen() {
      // document.documentElement.requestFullscreen() 这是原生方式
      if (!ScreenFull.isEnabled) {
        this.$message.warning('当前全屏不可用')
        return
      }
      ScreenFull.toggle() // 全屏方法
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
