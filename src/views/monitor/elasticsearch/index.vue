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
              节点名称
            </div>
            <div class="card-panel-num">{{ entity.clusterName }}</div>
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
          <div class="card-panel-num">{{ entity.port }}</div>
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
            节点个数
          </div>
          <count-to :start-val="0" :end-val="entity.numberOfDataNodes" :duration="3600" class="card-panel-num" />
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
            分片个数
          </div>
          <count-to :start-val="0" :end-val="entity.activeShards" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>

  <el-row>
	  <el-table v-loading="loading" :data="this.entity.clusterList">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <div v-for="item in props.row.mappingList" :key="item">
              <el-form-item label="字段名称">
                <el-input id="name" v-model="item.name" readonly />
              </el-form-item>
              <el-form-item label="类型">
                <el-input id="type" v-model="item.type" readonly />
              </el-form-item>
            </div>
          </el-form>
        </template>
      </el-table-column>
	    <el-table-column label="序号"  type="index" width="80px">
	      <template slot-scope="scope">{{ scope.$index+1 }}</template>
	    </el-table-column>
        <el-table-column label="索引名称" prop="index" />
        <el-table-column label="分片个数" prop="numberOfShards" />
        <el-table-column label="节点个数" prop="numberOfReplicas" />
        <el-table-column label="状态" prop="status" width="420px">
          <template slot-scope="scope">
            <el-radio-group name="status" v-model="scope.row.status" size="small">
            <el-radio-button label="Started">Started</el-radio-button>
            <el-radio-button label="Initializing">Initializing</el-radio-button>
            <el-radio-button label="Unassigned">Unassigned</el-radio-button>
            <el-radio-button label="Relocating">Relocating</el-radio-button>
          </el-radio-group>
        </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-search" @click="handleOper(scope.row.index)">&nbsp;操作</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { getInfo } from "@/api/monitor/elasticsearch";
import CountTo from 'vue-count-to'

export default {
  name: "ES",
  components: {
    CountTo
  },
  data() {
    return {
      // 加载层信息
      loading: true,
      entity: []
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询信息 */
    getList() {
      this.loading = true;
      getInfo().then((response) => {
        this.entity = response;
        this.loading = false;
      });
    },
    /** 操作查询 */
    handleOper(name) {
      // 根据 es的 name 扩展
      this.$router.push("/monitor/elasticsearch/" + name);
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
