<template>
  <div>
    <svg-icon icon-class="question" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'Doc',
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