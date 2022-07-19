<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="任务名称" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          placeholder="请输入任务名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务组名" prop="taskGroup">
        <el-select
          v-model="queryParams.taskGroup"
          placeholder="请任务组名"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in taskGroupOptions"
            :key="dict.itemCode"
            :label="dict.itemName"
            :value="dict.itemCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleClean"
        >清空</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="taskLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" prop="id" />
      <el-table-column label="任务名称" align="center" prop="taskName" :show-overflow-tooltip="true" />
      <el-table-column label="任务组名" align="center" prop="taskGroup" :formatter="taskGroupFormat" :show-overflow-tooltip="true"  />
      <el-table-column label="调用目标字符串" align="center" prop="invokeTarget" :show-overflow-tooltip="true" />
      <el-table-column label="日志信息" align="center" prop="taskMessage" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="NORMAL"
            inactive-value="PAUSE"
            disabled
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >详细</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 调度日志详细 -->
    <el-dialog title="调度日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志序号：">{{ form.id }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.taskName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ form.taskGroup }}</el-form-item>
            <el-form-item label="执行时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用方法：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日志信息：">{{ form.taskMessage }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行状态：">
              <div v-if="form.status == 'NORMAL'">正常</div>
              <div v-else-if="form.status == 'PAUSE'">暂停</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status == 0">{{ form.exceptionInfo }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTaskLog, delTaskLog, cleanTaskLog } from "@/api/monitor/taskLog";
import { exportFile } from "@/utils/zipdownload";

export default {
  name: "TaskLog",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      names: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 调度日志表格数据
      taskLogList: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 执行状态字典
      statusOptions: [],
      // 任务组名字典
      taskGroupOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        taskName: undefined,
        taskGroup: undefined,
        status: undefined,
        order: {
          key: 'createTime',
          val: 'desc' 
        }
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_task_status").then(response => {
      this.statusOptions = response;
    });
    this.getDicts("sys_task_group").then(response => {
      this.taskGroupOptions = response;
    });
  },
  methods: {
    /** 查询调度日志列表 */
    getList() {
      this.loading = true;
      listTaskLog(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.taskLogList = response.content;
          this.total = response.totalElements;
          this.loading = false;
        }
      );
    },
    // 执行状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 任务组名字典翻译
    taskGroupFormat(row, column) {
      return this.selectDictLabel(this.taskGroupOptions, row.taskGroup);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.names = selection.map(item => item.taskName);
      this.multiple = !selection.length;
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = [row.id];
      if (row.id == undefined)
        ids = this.ids;
      this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTaskLog(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm("是否确认清空所有日志数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return cleanTaskLog();
        }).then(() => {
          this.getList();
          this.msgSuccess("清空成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      var data = {
        order: {
          key: "createTime",
          val: "desc"
        },
        whereList: [
          { key: 'taskName', opt: 'like', val: this.queryParams.taskName },
          { key: 'taskGroup', val: this.queryParams.taskGroup }
        ]
      }
      const url = '/monitor/taskLog/export';
      this.$confirm('是否确认导出所有数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        exportFile(url, data);        	
      });
    }
  }
};
</script>