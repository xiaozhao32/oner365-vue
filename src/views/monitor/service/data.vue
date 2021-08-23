<template>
  <div class="dashboard-editor-container">
    <iframe v-show="loading" id="show-iframe" frameborder=0 name="showHere" scrolling=auto src="">
      
    </iframe>
  </div>
</template>

<script>
import { getUrl } from "@/api/index";
export default {
  name: 'Index',
  data() {
    return {
      loading: true,
    }
  },
  created() {
    this.getInfo();
  },
  watch: {
  },
  mounted () {
    const oIframe = document.getElementById('show-iframe');
    const deviceWidth = document.documentElement.clientWidth-150;
    const deviceHeight = document.documentElement.clientHeight-80;
    oIframe.style.width = deviceWidth + 'px';
    oIframe.style.height = deviceHeight + 'px';
  },
  methods: {
    getInfo() {
      this.loading = true;
      getUrl().then(response => {
        const oIframe = document.getElementById('show-iframe');
        oIframe.src = response
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 0px;
  background-color: rgb(240, 242, 245);
  position: relative;
  margin-bottom: 32px;
}
</style>

