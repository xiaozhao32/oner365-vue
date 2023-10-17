<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="坐标名称" prop="locationName" :inline="true" label-width="98px">
        <el-input
          id="locationName"
          v-model="queryParams.locationName"
          placeholder="请输入坐标名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleQuery"
        />
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
    </el-row>
    
    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" prop="id" />
      <el-table-column label="坐标名称" align="center" prop="locationName" width="200" />
      <el-table-column label="坐标信息" align="center" prop="locationPoint" :show-overflow-tooltip="false">
        <template slot-scope="scope">
          {{ scope.row.locationPoint }}
        </template>
      </el-table-column>
      <el-table-column label="坐标描述" align="center" prop="locationDesc" width="280" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="200" />
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
    
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <el-form-item label="坐标名称" prop="locationName">
          <el-input id="locationName" v-model="form.locationName" prefix-icon="el-icon-user-solid" placeholder="请输入坐标名称" />
        </el-form-item>
        <el-form-item label="坐标经度" prop="locationPoint.lon">
          <el-input id="lon" v-model="form.locationPoint.lon" prefix-icon="el-icon-user-solid" placeholder="请输入坐标经度" />
        </el-form-item>
        <el-form-item label="坐标纬度" prop="locationPoint.lat">
          <el-input id="lat" v-model="form.locationPoint.lat" prefix-icon="el-icon-user-solid" placeholder="请输入坐标纬度" />
        </el-form-item>
        <el-form-item label="坐标描述" prop="locationDesc">
          <el-input id="locationDesc" v-model="form.locationDesc" type="textarea" placeholder="请输入坐标描述"></el-input>
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
import { sampleLocationList, saveSampleLocation, getSampleLocation, deleteSampleLocation } from "@/api/monitor/sampleLocation";
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
        locationName: ''
      },
      // 表单参数
      form: {
        locationPoint:{}
      },
      dataList: [],
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        locationName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
	this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      sampleLocationList(this.queryParams).then(response => {
    	  this.dataList = response.content;
        this.total = response.totalElements;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: '',
        locationPoint: {}
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加坐标信息";
      this.form.locationPoint = {};
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSampleLocation(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改坐标信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
        	saveSampleLocation(this.form).then(response => {
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
      this.$confirm('是否确认删除?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return deleteSampleLocation(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    }
  }
};
</script>