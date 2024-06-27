<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.itemCode"
            :label="dict.itemName"
            :value="dict.itemCode"
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

    <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="配置名称" align="center" prop="configName" />
      <el-table-column label="配置内容" align="center" prop="configValue" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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

    <!-- 添加或修改nt_sys_config对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="配置名称" prop="configName">
          <el-input id="configName" v-model="form.configName" prefix-icon="el-icon-s-flag" placeholder="请输入配置名称" />
        </el-form-item>
        <el-form-item label="配置内容" prop="configValue">
          <el-input id="configValue" v-model="form.configValue" prefix-icon="el-icon-s-flag" placeholder="请输入配置内容" />
        </el-form-item>
        <el-form-item label="创建人" prop="createUser">
          <el-input id="createUser" v-model="form.createUser" prefix-icon="el-icon-s-flag" readonly="readonly" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group id="status" v-model="form.status">
            <el-radio
                v-for="dict in statusOptions"
                :key="dict.itemCode"
                :label="dict.itemCode"
              >{{dict.itemName}}</el-radio>
          </el-radio-group>
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
import { listConfig, getConfig, delConfig, saveConfig, changeStatus, checkConfigName } from "@/api/system/config";
import { exportFile } from "@/utils/zipdownload";


export default {
  name: "sysConfig",
  components: {
  },
  data() {

    var validateCode = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error('配置名称不能为空'));
      } else {
        const id = this.form.id;
        checkConfigName(id, value).then(response => {
          if (response === true) {
            callback(new Error('配置名称已存在'));
          } else {
            callback();
          }
        });        
     }
    };

    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // nt_sys_config表格数据
      configList: [],
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
        status: undefined,
        order: {
          key: 'updateTime',
          val: 'desc' 
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        configName: [
          { required: true, validator: validateCode, trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ]

      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_status").then(response => {
      this.statusOptions = response;
    });
  },
  methods: {
    /** 查询nt_sys_config列表 */
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then(response => {
        this.configList = response.content;
        this.total = response.totalElements;
        this.loading = false;
      });
    },
    // 状态字典翻译
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
        configName: undefined,
        configValue: undefined,
        status: 'YES'
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
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
      this.names = selection.map(item => item.configName)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status === "YES" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '"吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
          this.getList();
        }).catch(function() {
          row.status = row.status === "NO" ? "YES" : "NO";
        });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getConfig(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          saveConfig(this.form).then(response => {
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
      const names = row.configName || this.names;
      this.$confirm('是否确认删除 "' + names + '" ?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delConfig(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      var data = {
        order: { key: 'updateTime', val: 'desc' },
        whereList: [
          // 查询参数 
          { key: 'status', opt: 'enum', val: queryParams.status }
        ]
      }
      const url = '/system/config/export';
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
