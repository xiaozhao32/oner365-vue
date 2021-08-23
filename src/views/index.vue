<template>
  <div class="app-container">
    <el-row :gutter="60" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleService">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
                                服务监控数
            </div>
            <count-to :start-val="0" :end-val="countService" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleServer">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div><count-to :start-val="0" v-if="server.mem" :end-val="server.mem.used" :duration="3600" :decimals="2" prefix="内存: " suffix="G" class="card-panel-num" /></div>
            <div><count-to :start-val="0" v-if="server.mem" :end-val="server.mem.usage" :duration="3600" :decimals="2" prefix="使用率: " suffix="%" class="card-panel-num" /></div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleRoute">
          <div class="card-panel-icon-wrapper icon-search">
            <svg-icon icon-class="search" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
                                路由监控
            </div>
            <count-to :start-val="0" :end-val="countRoute" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleUser">
          <div class="card-panel-icon-wrapper icon-monitor">
            <svg-icon icon-class="monitor" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
                                用户数
            </div>
            <count-to :start-val="0" :end-val="countUser" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="60" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleCache">
          <div class="card-panel-icon-wrapper icon-star">
            <svg-icon icon-class="star" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
                                缓存监控
            </div>
            <count-to :start-val="0" :end-val="countCache" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleRabbitmq">
          <div class="card-panel-icon-wrapper icon-server">
            <svg-icon icon-class="server" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
                                队列监控
            </div>
            <count-to :start-val="0" :end-val="countQueues" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleTask">
          <div class="card-panel-icon-wrapper icon-log">
            <svg-icon icon-class="log" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
                                定时任务
            </div>
            <count-to :start-val="0" :end-val="countTask" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header"><span>cpu信息</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="commandstats" style="height: 300px" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span>内存信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="usedmemory" style="height: 300px" />
          </div>
        </el-card>
      </el-col>

    </el-row>

  </div>
</template>
<script>
import { getCacheList } from "@/api/monitor/cache";
import { getServer } from "@/api/monitor/server";
import { listService } from "@/api/monitor/service";
import { listRoute } from "@/api/monitor/route";
import { listUser } from "@/api/system/user";
import { getIndex as getRabbitmq } from "@/api/monitor/rabbitmq";
import { listTask } from "@/api/monitor/task";
import CountTo from 'vue-count-to'
import echarts from "echarts";

export default {
  name: "Index",
  components: {
    CountTo
  },
  data() {
    return {
      countService: 0,
      countRoute: 0,
      countUser: 0,
      countCache: 0,
      countQueues: 0,
      countTask: 0,
      server: [],
      cache: [],
      queryParams: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getServiceList();
    this.getServerList();
    this.getRouteList();
    this.getUserList();
    this.getCacheList();
    this.getRabbitmq();
    this.getTaskList();
  },
  methods: {
    /* 服务信息 */ 
    getServiceList() {
      listService().then(response => {
        this.countService = response.length;
      });
    },
    /* 服务器信息 */
    getServerList() {
      getServer().then(response => {
        this.server = response;
        var cpudata = [{'name':'用户使用率','value':this.server.cpu.used},{'name':'系统使用率','value':this.server.cpu.sys},{'name':'当前空闲率','value':this.server.cpu.free}]
        this.commandstats = echarts.init(this.$refs.commandstats, "macarons");
        this.commandstats.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c}% ({d}%)",
          },
          series: [{
            name: "cpu信息",
            type: "pie",
            roseType: "radius",
            radius: [15, 95],
            center: ["50%", "38%"],
            data: cpudata,
            animationEasing: "cubicInOut",
            animationDuration: 1000
          }]
        });

        var memorydata = [{'name':'当前使用率','value':this.server.mem.used},{'name':'当前空闲率','value':this.server.mem.free}]
        this.usedmemory = echarts.init(this.$refs.usedmemory, "macarons");
        this.usedmemory.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c}G ({d}%)",
          },
          series: [{
            name: "内存信息",
            type: "pie",
            roseType: "radius",
            radius: [15, 95],
            center: ["50%", "38%"],
            data: memorydata,
            animationEasing: "cubicInOut",
            animationDuration: 1000
          }]
        });
      });
    },
    /* 路由信息 */
    getRouteList() {
      listRoute(this.queryParams).then(response => {
        this.countRoute = response.totalElements;
      });
    },
    /* 用户信息 */
    getUserList() {
      listUser(this.queryParams).then(response => {
        this.countUser = response.totalElements;
      });
    },
    /* 缓存数 */
    getCacheList() {
      getCacheList().then((response) => {
        let size = 0;
        response.forEach(function(item, index) {
          size += item.size;  
        });
        this.countCache = size;
      });
    },
    /* 队列信息 */
    getRabbitmq() {
      getRabbitmq().then((response) => {
        this.countQueues = response.object_totals.queues;
      });
    },
    /* 任务信息 */
    getTaskList() {
      listTask(this.queryParams).then(response => {
        this.countTask = response.totalElements;
      });
    },
    handleService() {
      this.$router.push("/service");
    },
    handleServer() {
      this.$router.push("/server");
    },
    handleTask() {
      this.$router.push("/task");
    },
    handleRoute() {
      this.$router.push("/route");
    },
    handleCache() {
      this.$router.push("/cache");
    },
    handleRabbitmq() {
      this.$router.push("/rabbitmq");
    },
    handleUser() {
      this.$router.push("/user");
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