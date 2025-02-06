<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
  
      <el-form-item label="服务名称" prop="projectName">
        <el-select id="projectName" v-model="queryParams.projectName" placeholder="服务名称" clearable size="small">
          <el-option
            v-for="project in projectList"
            :key="project"
            :label="project"
            :value="project"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日志等级" prop="level">
        <el-select id="level" v-model="queryParams.level" placeholder="日志级别" clearable size="small">
          <el-option
            v-for="level in levelList"
            :key="level.id"
            :label="level.name"
            :value="level.name"
          />
        </el-select>
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
    </el-row>
    
    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" prop="id" />
      <el-table-column label="服务名称" prop="projectName" width="200" />
      <el-table-column label="类名称" prop="loggerName" width="200" />
      <el-table-column label="日志等级" align="center" prop="level" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.level==='INFO'">{{ scope.row.level }}</el-tag>
          <el-tag type="warning" v-if="scope.row.level==='WARN'">{{ scope.row.level }}</el-tag>
          <el-tag type="danger" v-if="scope.row.level==='ERROR'">{{ scope.row.level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="日志内容" prop="message" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" class-name="small-padding fixed-width">
        <template slot-scope="scope">
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
  </div>
</template>

<script>
import { applicationLogList, getApplicationLog, deleteApplicationLog } from "@/api/application/log";
import { listRoute } from "@/api/monitor/route"
export default {
  name: "Data",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
    	  pageIndex: 1,
        pageSize: 10,
        level: '',
        projectName: ''
      },
      levelList:[
        {
          id: "info",
          name: "INFO"
        },
        {
          id: "warn",
          name: "WARN"
        },
        {
          id: "error",
          name: "ERROR"
        }
      ],
      projectList: [],
      // 表单参数
      form: {
      },
      dataList: [],
      // 表单校验
      rules: {
      }
    };
  },
  created() {
	  this.getList();
    this.getProjectList();
  },
  methods: {
    getList() {
      this.loading = true;
      applicationLogList(this.queryParams).then(response => {
    	  this.dataList = response.content;
        this.total = response.totalElements;
        this.loading = false;
      });
    },
    getProjectList() {
      var params = {};
      listRoute(params).then(response => {
        response.content.forEach( element => {
          this.projectList.push(element.id.substring(8));
        });
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
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
        return deleteApplicationLog(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    }
  }
};
</script>