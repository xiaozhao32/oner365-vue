<template>
  <div>
    <svg-icon icon-class="github" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'Git',
  data() {
    return {
      url: 'https://gitee.com/xiaozhao32'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>