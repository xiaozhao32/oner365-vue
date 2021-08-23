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
              {{ entity.cluster_name }}
            </div>
            <div class="card-panel-num">{{ entity.rabbitmq_version }}</div>
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
                           端口
          </div>
          <div class="card-panel-num">{{ port }}</div>
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
            Erlang 版本
          </div>
          <div class="card-panel-num">
            {{ entity.erlang_version }}
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
                           连接数
          </div>
          <count-to :start-val="0" :end-val="objectTotal.connections" :duration="3600" class="card-panel-num" />
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
            Channels
          </div>
          <count-to :start-val="0" :end-val="objectTotal.channels" :duration="3600" class="card-panel-num" />
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
            Exchanges
          </div>
          <count-to :start-val="0" :end-val="objectTotal.exchanges" :duration="3600" class="card-panel-num" />
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
            Queues
          </div>
          <count-to :start-val="0" :end-val="objectTotal.queues" :duration="3600" class="card-panel-num" />
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
            Consumers
          </div>
          <count-to :start-val="0" :end-val="objectTotal.consumers" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    </el-row>

    <el-row>
      <el-table v-loading="loading" :data="this.entity.listeners">
        <el-table-column label="序号"  type="index" width="80px">
          <template slot-scope="scope">{{ scope.$index+1 }}</template>
        </el-table-column>
        <el-table-column label="协议" prop="protocol" />
        <el-table-column label="节点" prop="node" />
        <el-table-column label="IP地址" prop="ip_address" />
        <el-table-column label="端口" prop="port" />
      </el-table>
	    
    </el-row>
  </div>
</template>

<script>
import { getIndex } from "@/api/monitor/rabbitmq";
import CountTo from 'vue-count-to'

export default {
  name: "Rabbitmq",
  components: {
    CountTo
  },
  data() {
    return {
      // 加载层信息
      loading: true,
      entity: [],
      port: undefined,
      objectTotal: {}
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询信息 */
    getList() {
      this.loading = true;
      getIndex().then((response) => {
        this.entity = response;
        this.objectTotal = this.entity.object_totals;
        var contexts = this.entity.contexts;
        if (contexts.length != 0) {
          this.port = contexts[0].port;
        }
        this.loading = false;
      });
    }
  }
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
