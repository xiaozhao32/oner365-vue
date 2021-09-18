<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="字典名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入字典名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典编码" prop="itemCode">
        <el-input
          v-model="queryParams.itemCode"
          placeholder="请输入字典编码"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="数据状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.itemCode"
            :label="dict.itemName"
            :value="dict.itemCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
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

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" prop="id" />
      <el-table-column label="字典类型编码" align="center" prop="typeId" />
      <el-table-column label="字典名称" align="center" prop="itemName" />
      <el-table-column label="字典编码" align="center" prop="itemCode" />
      <el-table-column label="字典排序" align="center" prop="itemOrder" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
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
        <el-form-item label="字典类型" prop="typeId">
          <el-input v-model="form.typeId" :disabled="true" />
        </el-form-item>
        <el-form-item label="字典名称" prop="itemName">
          <el-input v-model="form.itemName" prefix-icon="el-icon-s-flag" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典编码" prop="itemCode">
          <el-input v-model="form.itemCode" prefix-icon="el-icon-share" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="显示排序" prop="itemOrder">
          <el-input-number v-model="form.itemOrder" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.itemCode"
              :label="dict.itemCode"
            >{{dict.itemName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
import { listData, getData, delData, saveData, changeStatus, checkCode } from "@/api/system/dict/data";
import { listType, getType } from "@/api/system/dict/type";
import { exportFile } from "@/utils/zipdownload";

export default {
  name: "Data",
  data() {

    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('字典编号不能为空'));
      } else {
        const id = this.form.id;
        const typeId = this.form.typeId;
        checkCode(id, typeId, value).then(response => {
          if (response === 1) {
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
      dataList: [],
      // 默认字典类型
      defaultDictType: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        itemName: undefined,
        itemCode: undefined,
        typeId: undefined,
        status: undefined
      },
      // 表单参数
      form: {
    	  typeId: undefined
      },
      // 表单校验
      rules: {
        itemName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        itemCode: [
          { required: true, validator: validateCode, trigger: "blur" }
        ],
        itemOrder: [
          { required: true, message: "顺序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.queryParams.typeId = this.$route.params && this.$route.params.typeId;
    this.getType(this.queryParams.typeId);
    this.getTypeList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response;
    });
  },
  methods: {
    /** 查询字典类型详细 */
    getType(typeId) {
      getType(typeId).then(response => {
        this.queryParams.dictType = response.data;
        this.defaultDictType = response.data;
        this.getList(typeId);
      });
    },
    /** 查询字典类型列表 */
    getTypeList() {
      listType(this.queryParams).then(response => {
        this.typeOptions = response.content;
      });
    },
    /** 查询字典数据列表 */
    getList() {
      this.loading = true;
      listData(this.queryParams).then(response => {
        this.dataList = response.content;
        this.total = response.totalElements;
        this.loading = false;
      });
    },
    // 数据状态字典翻译
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
        id: undefined,
        typeId: undefined,
        itemName: undefined,
        itemCode: undefined,
        itemOrder: 1,
        status: "1",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
      this.getList(this.$route.params.typeId);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.dictType = this.defaultDictType;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典数据";
      this.form.typeId = this.$route.params.typeId;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.names = selection.map(item => item.itemName)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$confirm('确认要 "' + text + '" "' + row.itemName + '" 吗?', "警告", {
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getData(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改字典数据";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          saveData(this.form).then(response => {
            if (response.code === 1) {
              this.msgSuccess("保存成功");
              this.open = false;
              this.getList();
            }
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = [row.id];
      if (row.id == undefined)
        ids = this.ids;
      const names = row.itemName || this.names;
      this.$confirm('是否确认删除 "' + names + '" ?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delData(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      var data = {
        pageIndex: queryParams.pageIndex,
        pageSize: queryParams.pageSize,
        order: { key: 'itemOrder', val: 'asc' },
        whereList: [
          { key: 'typeId', opt: 'eq', val: queryParams.typeId },
          { key: 'itemCode', opt: 'like', val: queryParams.itemCode },
          { key: 'itemName', opt: 'like', val: queryParams.itemName },
          { key: 'status', opt: 'eq', val: queryParams.status }
        ]
      }
      const url = '/system/dict/exportItem';
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
