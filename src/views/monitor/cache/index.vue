<template>
  <div class="app-container">
    <el-row :gutter="60" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              Redis版本
            </div>
            <div class="card-panel-num" v-if="cache.info">{{ cache.info.redis_version }}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
                           运行模式
          </div>
          <div class="card-panel-num" v-if="cache.info">{{ cache.info.redis_mode == "standalone" ? "单机" : "集群" }}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-search">
          <svg-icon icon-class="search" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
                           端口
          </div>
          <div class="card-panel-num" v-if="cache.info">
            {{ cache.info.tcp_port }}
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-monitor">
          <svg-icon icon-class="monitor" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
                           客户端数
          </div>
          <div class="card-panel-num" v-if="cache.info">
            <count-to :start-val="0" :end-val="parseInt(cache.info.connected_clients)" :duration="3600" class="card-panel-num" />
          </div>
          
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-star">
          <svg-icon icon-class="star" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
                           运行时间
          </div>
          <div class="card-panel-num" v-if="cache.info">
            <count-to :start-val="0" :end-val="parseInt(cache.info.uptime_in_days)" suffix="天" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-server">
          <svg-icon icon-class="server" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
                           使用内存
          </div>
          <div class="card-panel-num" v-if="cache.info">
            {{ cache.info.used_memory_human }}
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-log">
          <svg-icon icon-class="log" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
                           使用CPU
          </div>
          <div class="card-panel-num" v-if="cache.info">
            <count-to :start-val="0" :end-val="parseFloat(cache.info.used_cpu_user_children)" suffix="%" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-guide">
          <svg-icon icon-class="guide" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
                           网络入口/出口
          </div>
          <div class="card-panel-num" v-if="cache.info">
            <count-to :start-val="0" :end-val="parseFloat(cache.info.instantaneous_input_kbps)" suffix="kps" :duration="3600" class="card-panel-num" />/
            <count-to :start-val="0" :end-val="parseFloat(cache.info.instantaneous_output_kbps)" suffix="kps" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col>
      <el-table :data="cacheList">
        <el-table-column type="selection" width="55" align="center" prop="index" />
        <el-table-column label="当前数据库" align="center" prop="name" />
        <el-table-column label="键值数量" align="center" prop="size" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除缓存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    </el-row>

    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header"><span>命令统计</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="commandstats" style="height: 420px" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span>内存信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="usedmemory" style="height: 420px" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCache, clearCache, getCacheList } from "@/api/monitor/cache";
import CountTo from 'vue-count-to'
import echarts from "echarts";

export default {
  name: "Server",
  components: {
    CountTo
  },
  data() {
    return {
      // 加载层信息
      loading: [],
      cacheList: [],
      // 统计命令信息
      commandstats: null,
      // 使用内存
      usedmemory: null,
      // cache信息
      cache: []
    }
  },
  created() {
    this.getList();
    this.getCacheList();
    this.openLoading();
  },
  methods: {
    /** 查缓存询信息 */
    getList() {
      getCache().then((response) => {
        this.cache = response;
        this.loading.close();

        this.commandstats = echarts.init(this.$refs.commandstats, "macarons");
        this.commandstats.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          series: [
            {
              name: "命令",
              type: "pie",
              roseType: "radius",
              radius: [15, 95],
              center: ["50%", "38%"],
              data: response.commandStats,
              animationEasing: "cubicInOut",
              animationDuration: 1000,
            },
          ],
        });
        this.usedmemory = echarts.init(this.$refs.usedmemory, "macarons");
        this.usedmemory.setOption({
          tooltip: {
            formatter: "{b} <br/>{a} : " + this.cache.info.used_memory_human,
          },
          series: [
            {
              name: "峰值",
              type: "gauge",
              detail: {
                formatter: this.cache.info.used_memory_human,
              },
              data: [
                {
                  value: parseFloat(this.cache.info.used_memory_human),
                  name: "内存消耗",
                },
              ],
            },
          ],
        });
      });
    },
    getCacheList() {
      getCacheList().then((response) => {
        this.cacheList = response;
      });
    },
    /** 清理缓存按钮操作 */
    handleDelete(row) {
      if (row.index === undefined) {
        this.msgError("请选择清理的缓存数据库！")
      } else {
        clearCache(row).then(response => {
          this.msgSuccess("清理成功");
          this.getCacheList();
        });
      }
    },
    // 打开加载层
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "拼命读取中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people,.icon-star {
        background: #40c9c6;
      }

      .icon-message,.icon-server {
        background: #36a3f7;
      }

      .icon-search,.icon-log {
        background: #f77b00
      }

      .icon-monitor,.icon-guide {
        background: #f4516c;
      }

    }

    .icon-people,.icon-star {
      color: #40c9c6;
    }

    .icon-message,.icon-server {
      color: #36a3f7;
    }

    .icon-search,.icon-log {
      color: #f77b00
    }

    .icon-monitor,.icon-guide {
      color: #f4516c;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
