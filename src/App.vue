<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Watermark from './warterMark.js'
export default  {
  name:  'App',
  mounted: function () {
    Watermark.set('权限管理')
  }
}
</script>
