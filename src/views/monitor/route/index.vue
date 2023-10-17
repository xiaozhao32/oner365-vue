<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="路由名称" prop="id">
        <el-input
          id="id"
          v-model="queryParams.id"
          placeholder="请输入路由名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select id="status" v-model="queryParams.status" placeholder="路由状态" clearable size="small">
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
          type="info"
          icon="el-icon-refresh"
          size="mini"
          @click="handleRefresh"
        >刷新</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="routeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" prop="id" />
      <el-table-column label="路由名称" align="center" prop="id" />
      <el-table-column label="过滤规则" align="center">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.filters[0].name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="路由规则" align="center" prop="predicates[0].args.pattern" />
      <el-table-column label="排序" align="center" prop="routeOrder" width="70" />
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

    <!-- 添加或修改路由对话框 -->
    <el-dialog :title="title" :visible.sync="open" slot="reference" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="路由名称" prop="id">
          <span slot="label">
            路由名称
            <el-tooltip placement="top">
              <div slot="content">
                示例：oner365-system
                <br />说明：名称必须与服务名称一致
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input id="id" v-model="form.id" prefix-icon="el-icon-s-flag" placeholder="请输入路由名称" />
        </el-form-item>
        <el-form-item label="路由规则" prop="pattern">
          <span slot="label">
            路由规则
            <el-tooltip placement="top">
              <div slot="content">
                示例：/system/**
                <br />说明：请求头对应服务进行转发
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input id="pattern" v-model="form.pattern" prefix-icon="el-icon-share" placeholder="请输入路由规则" />
        </el-form-item>
        <el-form-item label="请求地址" prop="uri">
          <span slot="label">
            请求地址
            <el-tooltip placement="top">
              <div slot="content">
                示例：lb://oner365-system
                <br />说明：名称必须与服务名称一致
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input id="uri" v-model="form.uri" type="textarea" placeholder="请输入请求地址" />
        </el-form-item>
        <el-form-item label="路由顺序" prop="routeOrder">
          <el-input-number id="routeOrder" v-model="form.routeOrder" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="路由状态" prop="status">
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
import { listRoute, getRoute, delRoute, saveRoute, changeStatus, refreshRoute } from "@/api/monitor/route";

export default {
  name: "Route",
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
      // 路由表格数据
      routeList: [],
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
        id: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "路由名称不能为空", trigger: "blur" }
        ],
        routeOrder: [
          { required: true, message: "路由顺序不能为空", trigger: "blur" }
        ],
        pattern: [
          { required: true, message: "路由规则不能为空", trigger: "blur" }
        ],
        uri: [
          { required: true, message: "请求地址不能为空", trigger: "blur" }
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
    /** 查询路由列表 */
    getList() {
      this.loading = true;
      listRoute(this.queryParams).then(response => {
        this.routeList = response.content;
        this.total = response.totalElements;
        this.loading = false;
      });
    },
    // 路由状态字典翻译
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
        routeOrder: 1,
        status: 'YES',
        filters: [],
        predicates: [],
        uri: undefined
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status === "YES" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '" "' + row.id + '"服务吗?', "警告", {
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
      this.title = "添加路由规则";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const routeId = row.id || this.ids
      getRoute(routeId).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改路由规则";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          saveRoute(this.form).then(response => {
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
      this.$confirm('是否确认删除 "' + ids + '" ?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRoute(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 刷新 */
    handleRefresh() {
      refreshRoute().then(() => {
        this.getList();
        this.msgSuccess("刷新成功");
      });
    }
  }
};
</script>