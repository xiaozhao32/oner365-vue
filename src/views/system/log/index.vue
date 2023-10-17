<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="请求IP" prop="operationIp">
        <el-input
          id="operationIp"
          v-model="queryParams.operationIp"
          placeholder="请输入请求IP"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务名称" prop="operationName">
        <el-input
          id="operationName"
          v-model="queryParams.operationName"
          placeholder="请输入服务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请求方法" prop="methodName">
        <el-select
          id="methodName"
          v-model="queryParams.methodName"
          placeholder="请求方法"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option value="POST">POST</el-option>
          <el-option value="PUT">PUT</el-option>
          <el-option value="DELETE">DELETE</el-option>
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" prop="id" />
      <el-table-column label="请求IP" align="center" prop="operationIp" width="150"/>
      <el-table-column label="服务名称" align="center" prop="operationName" width="150" />
      <el-table-column label="请求方法" align="center" prop="methodName" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.methodName === 'POST' ? 'success' : 'danger'">
            {{ scope.row.methodName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="请求地址" prop="operationPath" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
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

    <!-- 添加或修改日志对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="请求IP" prop="operationIp">
          <el-input id="operationIp" v-model="form.operationIp" placeholder="请输入请求IP" />
        </el-form-item>
        <el-form-item label="服务名称" prop="operationName">
          <el-input id="operationName" v-model="form.operationName" placeholder="请输入服务名称" />
        </el-form-item>
        <el-form-item label="请求方法" prop="methodName">
          <el-input id="methodName" v-model="form.methodName" placeholder="请输入请求方法" />
        </el-form-item>
        <el-form-item label="请求地址" prop="operationPath">
          <el-input id="operationPath" v-model="form.operationPath" placeholder="请输入请求地址" />
        </el-form-item>
        <el-form-item label="请求内容" prop="operationContext">
          <el-input id="operationContext" v-model="form.operationContext" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLog, getLog, delLog, saveLog, changeStatus } from "@/api/system/log";
import { exportFile } from "@/utils/zipdownload";

export default {
  name: "Log",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      names: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 日志表格数据
      logList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        order: {
          key: "createTime",
          val: "desc"
        },
        operationIp: undefined,
        operationName: undefined,
        methodName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        operationName: [
          { required: true, message: "服务名称不能为空", trigger: "blur" }
        ],
        methodName: [
          { required: true, message: "请求方法不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询日志列表 */
    getList() {
      this.loading = true;
      listLog(this.queryParams).then(response => {
        this.logList = response.content;
        this.total = response.totalElements;
        this.loading = false;
      });
    },
    // 日志状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        operationIp: undefined,
        operationName: undefined,
        operationPath: undefined,
        methodName: undefined,
        operationContext: undefined
      };
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
      this.ids = selection.map(item => item.id);
      this.names = selection.map(item => item.operationName);
      this.single = selection.length!=1;
      this.multiple = !selection.length;
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加职位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const logId = row.id || this.ids
      getLog(logId).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改职位";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          saveLog(this.form).then(response => {
            if (response.code === 1) {
              this.msgSuccess("保存成功");
            } else {
              this.msgError(response.msg);
            }
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = [row.id];
      if (row.id == undefined)
        ids = this.ids;
      const names = row.operationName || this.names;
      this.$confirm('是否确认删除 "' + names + '" ?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delLog(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
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
          { key: 'methodName', opt: 'eq', val: this.queryParams.methodName },
          { key: 'operationName', opt: 'like', val: this.queryParams.operationName },
          { key: 'operationIp', opt: 'like', val: this.queryParams.operationIp }
        ]
      }
      const url = '/system/log/export';
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