<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="字典名称" prop="typeName">
        <el-input
          id="typeName"
          v-model="queryParams.typeName"
          placeholder="请输入字典名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="typeCode">
        <el-input
          id="typeCode"
          v-model="queryParams.typeCode"
          placeholder="请输入字典类型"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          id="status"
          v-model="queryParams.status"
          placeholder="字典状态"
          clearable
          size="small"
        >
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

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字典编号" align="center" prop="id" />
      <el-table-column label="字典名称" align="center" prop="typeName" :show-overflow-tooltip="true" />
      <el-table-column label="字典类型" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'/system/dict/data/' + scope.row.id" class="link-type">
            <span>{{ scope.row.typeCode }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="typeDes" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            name="status"
            v-model="scope.row.status"
            active-value="YES"
            inactive-value="NO"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="typeName">
          <el-input id="typeName" v-model="form.typeName" prefix-icon="el-icon-s-flag" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item v-if="form.id == undefined" label="字典类型" prop="typeCode">
          <el-input id="typeCode" v-model="form.typeCode" prefix-icon="el-icon-share" placeholder="请输入字典类型" />
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
        <el-form-item label="备注" prop="typeDes">
          <el-input id="typeDes" v-model="form.typeDes" type="textarea" placeholder="请输入内容"></el-input>
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
import { listType, getType, delType, saveType, changeStatus, checkCode } from "@/api/system/dict/type";
import { exportFile } from "@/utils/zipdownload";

export default {
  name: "Dict",
  data() {

    var validateCode = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback(new Error('字典编号不能为空'));
      } else {
        const id = this.form.id;
        checkCode(id, value).then(response => {
          if (response === true) {
            callback(new Error('字典编号已存在'));
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
      names: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        typeName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        typeCode: [
          { required: true, validator: validateCode, trigger: "blur" }
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
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      listType(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
    	  this.typeList = response.content;
          this.total = response.totalElements;
          this.loading = false;
        }
      );
    },
    // 字典状态字典翻译
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
        typeId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: 'YES',
        remark: undefined
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典类型";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.names = selection.map(item => item.typeName)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status === "YES" ? "启用" : "停用";
      this.$confirm('确认要 "' + text + '" "' + row.typeName + '" 吗?', "警告", {
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const typeId = row.id || this.ids
      getType(typeId).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改字典类型";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          saveType(this.form).then(response => {
            if (response != null) {
              this.msgSuccess("保存成功");
            } else {
              this.msgError("保存失败");
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
      const names = row.typeName || this.names;
      this.$confirm('是否确认删除 "' + names + '" ?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delType(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      var data = {
        whereList: [
          { key: 'typeCode', opt: 'like', val: this.queryParams.typeCode },
          { key: 'typeName', opt: 'like', val: this.queryParams.typeName },
          { key: 'status', opt: 'enum', val: this.queryParams.status }
        ]
      }
      const url = '/system/dict/type/export';
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
